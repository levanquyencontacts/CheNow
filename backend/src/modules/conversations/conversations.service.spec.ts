import { ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  ConversationUserRole,
  MessageType,
  RoleCode,
} from '../../common/enums/common.enum';
import { Users } from '../users/users.entities';
import { ConversationsService } from './conversations.service';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

describe('ConversationsService role transitions', () => {
  function createHarness(
    accountRole: RoleCode,
    existingParticipantRole: ConversationUserRole,
  ) {
    const user = {
      id: 7,
      isActive: true,
      userRole: { role: { code: accountRole } },
    } as Users;
    const conversation = {
      id: 3,
      customerId: user.id,
      participants: [],
    } as unknown as Conversation;
    const participant = {
      id: 9,
      conversationId: conversation.id,
      userId: user.id,
      participantRole: existingParticipantRole,
      unreadCount: 0,
    } as ConversationParticipant;
    const historicalMessage = {
      id: 1,
      senderRole: existingParticipantRole,
    } as Message;
    let savedMessage: Message | null = null;
    const saveMock = jest.fn((entity: unknown, value: unknown) => {
      if (entity === Message) {
        savedMessage = {
          ...(value as Message),
          id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return Promise.resolve(savedMessage);
      }
      return Promise.resolve(value);
    });
    const incrementMock = jest.fn(() => Promise.resolve());
    const manager = {
      findOne: jest.fn((entity: unknown) => {
        if (entity === Conversation) return Promise.resolve(conversation);
        if (entity === Users) return Promise.resolve(user);
        if (entity === ConversationParticipant) {
          return Promise.resolve(participant);
        }
        if (entity === Message) return Promise.resolve(savedMessage);
        return Promise.resolve(null);
      }),
      create: jest.fn((_entity: unknown, value: unknown) => value),
      save: saveMock,
      update: jest.fn(() => Promise.resolve({ affected: 1 })),
      increment: incrementMock,
    } as unknown as EntityManager;
    const dataSource = {
      manager,
      transaction: jest.fn(
        (callback: (manager: EntityManager) => Promise<unknown>) =>
          callback(manager),
      ),
    } as unknown as DataSource;
    const service = new ConversationsService(
      {} as Repository<Conversation>,
      {} as Repository<Message>,
      {} as Repository<ConversationParticipant>,
      dataSource,
    );

    return {
      conversation,
      historicalMessage,
      incrementMock,
      participant,
      saveMock,
      service,
      user,
      getSavedMessage: () => savedMessage,
    };
  }

  it('updates an existing customer participant to admin context after promotion', async () => {
    const harness = createHarness(
      RoleCode.ADMIN,
      ConversationUserRole.CUSTOMER,
    );

    await harness.service.sendMessage(harness.user, {
      conversationId: harness.conversation.id,
      content: 'Admin response',
      type: MessageType.TEXT,
    });

    expect(harness.participant.participantRole).toBe(
      ConversationUserRole.ADMIN,
    );
    expect(harness.saveMock).toHaveBeenCalledWith(
      ConversationParticipant,
      expect.objectContaining({
        participantRole: ConversationUserRole.ADMIN,
      }),
    );
    expect(harness.getSavedMessage()?.senderRole).toBe(
      ConversationUserRole.ADMIN,
    );
    expect(harness.incrementMock).not.toHaveBeenCalled();
    expect(harness.historicalMessage.senderRole).toBe(
      ConversationUserRole.CUSTOMER,
    );
  });

  it('updates an existing admin participant to customer context on their own conversation', async () => {
    const harness = createHarness(
      RoleCode.CUSTOMER,
      ConversationUserRole.ADMIN,
    );

    await harness.service.sendMessage(harness.user, {
      conversationId: harness.conversation.id,
      content: 'Customer response',
      type: MessageType.TEXT,
    });

    expect(harness.participant.participantRole).toBe(
      ConversationUserRole.CUSTOMER,
    );
    expect(harness.getSavedMessage()?.senderRole).toBe(
      ConversationUserRole.CUSTOMER,
    );
    expect(harness.incrementMock).toHaveBeenCalledTimes(1);
    expect(harness.historicalMessage.senderRole).toBe(
      ConversationUserRole.ADMIN,
    );
  });

  it('rejects a customer accessing another customer conversation', async () => {
    const customer = {
      id: 7,
      userRole: { role: { code: RoleCode.CUSTOMER } },
    } as Users;
    const manager = {
      findOne: jest.fn(() =>
        Promise.resolve({ id: 3, customerId: 99 } as Conversation),
      ),
    } as unknown as EntityManager;
    const service = new ConversationsService(
      {} as Repository<Conversation>,
      {} as Repository<Message>,
      {} as Repository<ConversationParticipant>,
      { manager } as DataSource,
    );

    await expect(
      service.assertCanAccessConversation(3, customer),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
