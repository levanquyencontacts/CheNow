import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Socket } from 'socket.io';
import { RoleCode } from '../../common/enums/common.enum';
import { RoleSessionService } from '../roles/role-session.service';
import { Users } from '../users/users.entities';
import { UsersService } from '../users/users.service';
import { ConversationsGateway } from './conversations.gateway';
import { ConversationsService } from './conversations.service';
import { TypingConversationDto } from './dto/conversations.dto';

describe('ConversationsGateway authentication', () => {
  function createGateway(
    tokenType: 'access' | 'password-reset' | 'refresh',
    user: Users | null,
  ) {
    const jwtService = {
      verifyAsync: jest.fn(() => Promise.resolve({ sub: 1, type: tokenType })),
    } as unknown as JwtService;
    const usersService = {
      findProfileById: jest.fn(() => Promise.resolve(user)),
    } as unknown as UsersService;
    const disconnect = jest.fn();
    const join = jest.fn(() => Promise.resolve());
    const gateway = new ConversationsGateway(
      {} as ConversationsService,
      jwtService,
      usersService,
      {} as RoleSessionService,
    );
    const client = {
      data: {},
      disconnect,
      handshake: { auth: { token: 'token' }, headers: {} },
      join,
    } as unknown as Socket;

    return {
      gateway,
      client,
      disconnect,
      join,
    };
  }

  it.each(['password-reset', 'refresh'] as const)(
    'rejects a %s token',
    async (tokenType) => {
      const { gateway, client, disconnect } = createGateway(tokenType, null);
      await gateway.handleConnection(client);
      expect(disconnect).toHaveBeenCalledWith(true);
    },
  );

  it.each([
    { id: 1, isActive: false },
    { id: 1, isActive: true },
  ] as Users[])('rejects inactive or role-less users', async (user) => {
    const { gateway, client, disconnect } = createGateway('access', user);
    await gateway.handleConnection(client);
    expect(disconnect).toHaveBeenCalledWith(true);
  });

  it('accepts an active user with a current role', async () => {
    const user = {
      id: 1,
      isActive: true,
      userRole: { role: { code: RoleCode.CUSTOMER } },
    } as Users;
    const { gateway, client, disconnect, join } = createGateway('access', user);

    await gateway.handleConnection(client);

    expect(disconnect).not.toHaveBeenCalled();
    expect(join).toHaveBeenCalledWith('user:1');
  });

  it('rejects typing events when the customer cannot access the conversation', async () => {
    const user = {
      id: 1,
      isActive: true,
      userRole: { role: { code: RoleCode.CUSTOMER } },
    } as Users;
    const assertCanAccessConversation = jest.fn(() =>
      Promise.reject(new ForbiddenException('Cannot access this conversation')),
    );
    const gateway = new ConversationsGateway(
      { assertCanAccessConversation } as unknown as ConversationsService,
      {} as JwtService,
      {} as UsersService,
      {} as RoleSessionService,
    );
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));
    const client = {
      data: { user },
      to,
    } as unknown as Socket;

    const ack = await gateway.handleTypingStart(client, {
      conversationId: 99,
    });

    expect(assertCanAccessConversation).toHaveBeenCalledWith(99, user);
    expect(ack).toEqual({
      success: false,
      error: {
        message: 'Cannot access this conversation',
        messageCode: undefined,
      },
    });
    expect(to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it.each(['start', 'stop'] as const)(
    'emits typing:%s only after conversation authorization',
    async (action) => {
      const user = {
        id: 1,
        isActive: true,
        userRole: { role: { code: RoleCode.CUSTOMER } },
      } as Users;
      const assertCanAccessConversation = jest.fn(() => Promise.resolve());
      const gateway = new ConversationsGateway(
        { assertCanAccessConversation } as unknown as ConversationsService,
        {} as JwtService,
        {} as UsersService,
        {} as RoleSessionService,
      );
      const emit = jest.fn();
      const to = jest.fn(() => ({ emit }));
      const client = { data: { user }, to } as unknown as Socket;

      const ack =
        action === 'start'
          ? await gateway.handleTypingStart(client, { conversationId: 3 })
          : await gateway.handleTypingStop(client, { conversationId: 3 });

      expect(assertCanAccessConversation).toHaveBeenCalledWith(3, user);
      expect(to).toHaveBeenCalledWith('conversation:3');
      expect(emit).toHaveBeenCalledWith(`typing:${action}`, {
        conversationId: 3,
        userId: user.id,
      });
      expect(ack).toEqual({
        success: true,
        data: { conversationId: 3 },
      });
    },
  );

  it('validates typing conversationId as a positive integer DTO', async () => {
    const invalidDto = plainToInstance(TypingConversationDto, {
      conversationId: 0,
    });
    const validDto = plainToInstance(TypingConversationDto, {
      conversationId: '3',
    });

    await expect(validate(invalidDto)).resolves.not.toHaveLength(0);
    await expect(validate(validDto)).resolves.toHaveLength(0);
    expect(validDto.conversationId).toBe(3);
  });
});
