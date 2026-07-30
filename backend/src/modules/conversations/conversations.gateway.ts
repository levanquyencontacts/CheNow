import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import {
  OnModuleDestroy,
  OnModuleInit,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { Users } from '../users/users.entities';
import { UsersService } from '../users/users.service';
import { ConversationUserRole, RoleCode } from '../../common/enums/common.enum';
import {
  JoinConversationDto,
  LeaveConversationDto,
  ReadConversationDto,
  SendConversationMessageDto,
  TypingConversationDto,
} from './dto/conversations.dto';
import { ConversationsService } from './conversations.service';
import { RoleSessionService } from '../roles/role-session.service';

interface JwtPayload {
  sub: number;
  type?: 'access' | 'password-reset' | 'refresh';
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
export class ConversationsGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnModuleDestroy
{
  @WebSocketServer()
  private readonly server: Server;
  private unsubscribeRoleChanges?: () => void;

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly roleSessionService: RoleSessionService,
  ) {}

  onModuleInit() {
    this.unsubscribeRoleChanges = this.roleSessionService.subscribe(
      async (userId) => {
        const sockets = await this.server
          .in(this.userRoom(userId))
          .fetchSockets();
        sockets.forEach((socket) => {
          socket.emit('auth:role-changed');
          socket.disconnect(true);
        });
      },
    );
  }

  onModuleDestroy() {
    this.unsubscribeRoleChanges?.();
  }

  async handleConnection(client: Socket) {
    try {
      const token = this.getToken(client);
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      if (payload.type !== 'access') {
        throw new WsException('Only access tokens can connect socket');
      }

      const user = await this.usersService.findProfileById(payload.sub);

      if (!user?.isActive || !user.userRole?.role) {
        throw new WsException('User is inactive or has no role');
      }

      this.setCurrentUser(client, user);
      await client.join(this.userRoom(user.id));

      if (
        this.hasRole(user, RoleCode.ADMIN) ||
        this.hasRole(user, RoleCode.STAFF)
      ) {
        await client.join(this.adminRoom());
      }
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect() {}

  @SubscribeMessage('conversation:join')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinConversationDto,
  ) {
    const user = this.getCurrentUser(client);
    const conversation = await this.conversationsService.joinConversation(
      Number(body.conversationId),
      user,
    );

    await client.join(this.conversationRoom(Number(body.conversationId)));

    return {
      success: true,
      data: conversation,
    };
  }

  @SubscribeMessage('conversation:leave')
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: LeaveConversationDto,
  ) {
    await client.leave(this.conversationRoom(Number(body.conversationId)));

    return {
      success: true,
      data: {
        conversationId: Number(body.conversationId),
      },
    };
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: SendConversationMessageDto,
  ) {
    try {
      const user = this.getCurrentUser(client);
      const result = await this.conversationsService.sendMessage(user, body);
      const conversationId = result.message.conversationId;
      const room = this.conversationRoom(conversationId);

      await client.join(room);

      // Customer messages also reach role:admin so inbox updates without joining the thread.
      const messageAudience =
        result.message.senderRole === ConversationUserRole.CUSTOMER
          ? client.to(room).to(this.adminRoom())
          : client.to(room);

      messageAudience.emit('message:new', result.message);

      const audience =
        await this.conversationsService.getConversationAudience(conversationId);
      await this.emitConversationUpdatedToUsers(
        conversationId,
        audience.userIds,
      );

      if (audience.notifyAdmins) {
        await this.emitConversationBroadcastToAdmins(conversationId);
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return this.toSocketErrorAck(error);
    }
  }

  @SubscribeMessage('conversation:read')
  async handleReadConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: ReadConversationDto,
  ) {
    const user = this.getCurrentUser(client);
    const result = await this.conversationsService.markAsRead(
      Number(body.conversationId),
      user,
    );

    const conversation =
      await this.conversationsService.getConversationListResponseForUser(
        result.conversationId,
        result.userId,
      );

    this.server
      .to(this.userRoom(result.userId))
      .emit('conversation:updated', conversation);

    return {
      success: true,
      data: {
        ...result,
        conversation,
      },
    };
  }

  @SubscribeMessage('message:read')
  handleReadMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: ReadConversationDto,
  ) {
    return this.handleReadConversation(client, body);
  }

  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: TypingConversationDto,
  ) {
    return this.handleTypingEvent(client, body, 'typing:start');
  }

  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: TypingConversationDto,
  ) {
    return this.handleTypingEvent(client, body, 'typing:stop');
  }

  private getToken(client: Socket) {
    const handshakeAuth = client.handshake.auth as
      | { token?: unknown }
      | undefined;
    const authToken = handshakeAuth?.token;
    const authorization = client.handshake.headers.authorization;

    if (typeof authToken === 'string' && authToken) {
      return authToken.replace(/^Bearer\s+/i, '');
    }

    if (typeof authorization === 'string' && authorization) {
      return authorization.replace(/^Bearer\s+/i, '');
    }

    throw new WsException('Missing socket token');
  }

  private getCurrentUser(client: Socket) {
    const data = client.data as unknown as { user?: Users };

    if (!data.user) {
      throw new WsException('Socket user is not authenticated');
    }

    return data.user;
  }

  private setCurrentUser(client: Socket, user: Users) {
    const data = client.data as unknown as { user?: Users };
    data.user = user;
  }

  private hasRole(user: Users, roleCode: RoleCode) {
    return user.userRole?.role.code === roleCode;
  }

  private userRoom(userId: number) {
    return `user:${userId}`;
  }

  private adminRoom() {
    return 'role:admin';
  }

  private conversationRoom(conversationId: number) {
    return `conversation:${conversationId}`;
  }

  private async emitConversationUpdatedToUsers(
    conversationId: number,
    userIds: number[],
  ) {
    await Promise.all(
      userIds.map(async (userId) => {
        const conversation =
          await this.conversationsService.getConversationListResponseForUser(
            conversationId,
            userId,
          );

        this.server
          .to(this.userRoom(userId))
          .emit('conversation:updated', conversation);
      }),
    );
  }

  /**
   * Push inbox updates to every connected admin with that admin's unreadCount.
   */
  private async emitConversationBroadcastToAdmins(conversationId: number) {
    const adminSockets = await this.server.in(this.adminRoom()).fetchSockets();
    const emittedUserIds = new Set<number>();

    await Promise.all(
      adminSockets.map(async (socket) => {
        const user = (socket.data as { user?: Users }).user;

        if (!user?.id || emittedUserIds.has(user.id)) {
          return;
        }

        emittedUserIds.add(user.id);

        const conversation =
          await this.conversationsService.getConversationListResponseForUser(
            conversationId,
            user.id,
          );

        socket.emit('conversation:broadcast', conversation);
      }),
    );
  }

  private toSocketErrorAck(error: unknown) {
    const response =
      typeof error === 'object' && error !== null && 'getResponse' in error
        ? (error as { getResponse: () => unknown }).getResponse()
        : undefined;

    if (typeof response === 'object' && response !== null) {
      const message =
        'message' in response && typeof response.message === 'string'
          ? response.message
          : 'Socket request failed';
      const messageCode =
        'messageCode' in response && typeof response.messageCode === 'string'
          ? response.messageCode
          : undefined;

      return {
        success: false,
        error: {
          message,
          messageCode,
        },
      };
    }

    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Socket request failed',
      },
    };
  }

  private async handleTypingEvent(
    client: Socket,
    body: TypingConversationDto,
    eventName: 'typing:start' | 'typing:stop',
  ) {
    try {
      const user = this.getCurrentUser(client);
      await this.conversationsService.assertCanAccessConversation(
        body.conversationId,
        user,
      );
      client.to(this.conversationRoom(body.conversationId)).emit(eventName, {
        conversationId: body.conversationId,
        userId: user.id,
      });

      return {
        success: true,
        data: { conversationId: body.conversationId },
      };
    } catch (error) {
      return this.toSocketErrorAck(error);
    }
  }
}
