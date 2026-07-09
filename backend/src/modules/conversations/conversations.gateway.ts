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
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { Users } from '../users/users.entities';
import { UsersService } from '../users/users.service';
import { RoleCode } from '../../common/enums/common.enum';
import {
  JoinConversationDto,
  LeaveConversationDto,
  ReadConversationDto,
  SendConversationMessageDto,
  TypingConversationDto,
} from './dto/conversations.dto';
import { ConversationsService } from './conversations.service';

interface JwtPayload {
  sub: number;
  type?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export class ConversationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.getToken(client);
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      if (payload.type === 'refresh') {
        throw new WsException('Refresh token cannot connect socket');
      }

      const user = await this.usersService.findProfileById(payload.sub);

      if (!user) {
        throw new WsException('User not found');
      }

      this.setCurrentUser(client, user);
      await client.join(this.userRoom(user.id));

      if (this.hasRole(user, RoleCode.ADMIN)) {
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
    const user = this.getCurrentUser(client);
    const result = await this.conversationsService.sendMessage(user, body);
    const conversationId = result.message.conversationId;
    const room = this.conversationRoom(conversationId);

    await client.join(room);

    client.to(room).emit('message:new', result.message);

    const audience =
      await this.conversationsService.getConversationAudience(conversationId);
    const rooms = audience.userIds.map((userId) => this.userRoom(userId));

    if (audience.notifyAdmins) {
      rooms.push(this.adminRoom());
    }

    this.server.to(rooms).emit('conversation:updated', result.conversation);

    return {
      success: true,
      data: result,
    };
  }

  @SubscribeMessage('message:read')
  async handleReadMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: ReadConversationDto,
  ) {
    const user = this.getCurrentUser(client);
    const result = await this.conversationsService.markAsRead(
      Number(body.conversationId),
      user,
    );

    this.server
      .to(this.conversationRoom(result.conversationId))
      .emit('message:read', result);

    return {
      success: true,
      data: result,
    };
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: TypingConversationDto,
  ) {
    const user = this.getCurrentUser(client);
    client
      .to(this.conversationRoom(Number(body.conversationId)))
      .emit('typing:start', {
        conversationId: Number(body.conversationId),
        userId: user.id,
      });

    return { success: true };
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: TypingConversationDto,
  ) {
    const user = this.getCurrentUser(client);
    client
      .to(this.conversationRoom(Number(body.conversationId)))
      .emit('typing:stop', {
        conversationId: Number(body.conversationId),
        userId: user.id,
      });

    return { success: true };
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
    return user.userRoles?.some((userRole) => userRole.role.code === roleCode);
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
}
