import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  Not,
  Repository,
} from 'typeorm';
import {
  ConversationUserRole,
  MessageType,
  RoleCode,
} from '../../common/enums/common.enum';
import { Users } from '../users/users.entities';
import {
  ConversationPaginationDto,
  SendConversationMessageDto,
} from './dto/conversations.dto';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationsRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(ConversationParticipant)
    private readonly participantsRepository: Repository<ConversationParticipant>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: ConversationPaginationDto, currentUser: Users) {
    const { page = 1, limit = 10 } = query;
    const currentUserRole = this.getConversationRole(currentUser);
    const where: FindOptionsWhere<Conversation> =
      currentUserRole === ConversationUserRole.CUSTOMER
        ? { customerId: currentUser.id }
        : {};

    const [items, total] = await this.conversationsRepository.findAndCount({
      where,
      relations: [
        'customer',
        'lastMessage',
        'participants',
        'participants.user',
      ],
      order: {
        lastMessageAt: 'DESC',
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = await Promise.all(
      items.map((conversation) =>
        this.toConversationListResponse(conversation, currentUser.id),
      ),
    );

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number, currentUser: Users) {
    const conversation = await this.findConversationWithRelations(id);

    this.ensureCanViewConversation(conversation, currentUser);

    return this.toConversationResponse(conversation);
  }

  async findMessages(
    id: number,
    query: ConversationPaginationDto,
    currentUser: Users,
  ) {
    const conversation = await this.ensureConversation(id);
    this.ensureCanViewConversation(conversation, currentUser);

    const { page = 1, limit = 30, order = 'ASC' } = query;
    const [items, total] = await this.messagesRepository.findAndCount({
      where: { conversationId: id },
      relations: ['sender'],
      order: { createdAt: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: items.map((message) => this.toMessageResponse(message)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async sendMessage(currentUser: Users, body: SendConversationMessageDto) {
    this.validateMessageBody(body.type, body.content);

    return this.dataSource.transaction(async (manager) => {
      const conversation = body.conversationId
        ? await this.ensureConversation(body.conversationId, manager)
        : await this.findOrCreateCustomerConversation(manager, currentUser);

      const senderRole = await this.resolveSenderRole(
        manager,
        conversation,
        currentUser.id,
      );

      await this.ensureParticipant(
        manager,
        conversation.id,
        currentUser.id,
        senderRole,
      );

      const message = await this.createMessage(manager, conversation.id, {
        senderId: currentUser.id,
        senderRole,
        type: body.type ?? MessageType.TEXT,
        content: body.content,
      });

      const latestConversation = await this.findConversationWithLatestData(
        manager,
        conversation.id,
      );

      return {
        message: this.toMessageResponse(message),
        conversation: this.toConversationResponse(latestConversation),
      };
    });
  }

  async joinConversation(conversationId: number, currentUser: Users) {
    const conversation = await this.ensureConversation(conversationId);
    this.ensureCanViewConversation(conversation, currentUser);

    const senderRole = await this.resolveSenderRole(
      this.dataSource.manager,
      conversation,
      currentUser.id,
    );

    await this.ensureParticipant(
      this.dataSource.manager,
      conversation.id,
      currentUser.id,
      senderRole,
    );

    // lastReadAt is updated only via markAsRead / conversation:read
    return this.findById(conversation.id, currentUser);
  }

  async markAsRead(conversationId: number, currentUser: Users) {
    const conversation = await this.ensureConversation(conversationId);
    this.ensureCanViewConversation(conversation, currentUser);

    const senderRole = await this.resolveSenderRole(
      this.dataSource.manager,
      conversation,
      currentUser.id,
    );

    const participant = await this.ensureParticipant(
      this.dataSource.manager,
      conversation.id,
      currentUser.id,
      senderRole,
    );

    const lastReadAt = new Date();
    await this.participantsRepository.update(participant.id, {
      lastReadAt,
      unreadCount: 0,
    });

    return {
      conversationId,
      userId: currentUser.id,
      lastReadAt,
    };
  }

  async getConversationListResponseForUser(
    conversationId: number,
    userId: number,
  ) {
    const conversation =
      await this.findConversationWithRelations(conversationId);

    return this.toConversationListResponse(conversation, userId);
  }

  async getConversationAudience(conversationId: number) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const userIds = new Set<number>([conversation.customerId]);
    conversation.participants?.forEach((participant) => {
      userIds.add(participant.userId);
    });

    return {
      userIds: [...userIds],
      notifyAdmins: true,
    };
  }

  async updateTitle(conversationId: number, currentUser: Users, title: string) {
    const conversation = await this.ensureConversation(conversationId);
    this.ensureCanViewConversation(conversation, currentUser);
    await this.conversationsRepository.update(conversationId, { title });

    return this.findById(conversationId, currentUser);
  }

  async assertCanAccessConversation(
    conversationId: number,
    currentUser: Users,
  ): Promise<void> {
    const conversation = await this.ensureConversation(conversationId);
    this.ensureCanViewConversation(conversation, currentUser);
  }

  private async createMessage(
    manager: EntityManager,
    conversationId: number,
    messageData: {
      senderId: number;
      senderRole: ConversationUserRole;
      type: MessageType;
      content?: string | null;
    },
  ) {
    const message = manager.create(Message, {
      conversationId,
      ...messageData,
    });
    const savedMessage = await manager.save(Message, message);

    await manager.update(Conversation, conversationId, {
      lastMessageId: savedMessage.id,
      lastMessageAt: savedMessage.createdAt,
    });

    if (messageData.senderRole === ConversationUserRole.CUSTOMER) {
      await manager.increment(
        ConversationParticipant,
        {
          conversationId,
          userId: Not(messageData.senderId),
        },
        'unreadCount',
        1,
      );
    }

    const messageWithSender = await manager.findOne(Message, {
      where: { id: savedMessage.id },
      relations: ['sender'],
    });

    return messageWithSender ?? savedMessage;
  }

  private async findOrCreateCustomerConversation(
    manager: EntityManager,
    currentUser: Users,
  ) {
    await this.ensureUserHasRole(manager, currentUser.id, RoleCode.CUSTOMER);

    let conversation = await manager.findOne(Conversation, {
      where: { customerId: currentUser.id },
    });

    if (!conversation) {
      conversation = manager.create(Conversation, {
        customerId: currentUser.id,
      });
      conversation = await manager.save(Conversation, conversation);
    }

    await this.ensureParticipant(
      manager,
      conversation.id,
      currentUser.id,
      ConversationUserRole.CUSTOMER,
    );

    return conversation;
  }

  private async ensureConversation(
    conversationId: number,
    manager: EntityManager = this.dataSource.manager,
  ) {
    const conversation = await manager.findOne(Conversation, {
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  private async ensureParticipant(
    manager: EntityManager,
    conversationId: number,
    userId: number,
    participantRole: ConversationUserRole,
  ) {
    const participant = await manager.findOne(ConversationParticipant, {
      where: { conversationId, userId },
    });

    if (participant) {
      if (participant.participantRole !== participantRole) {
        participant.participantRole = participantRole;
        // Unread messages remain unread across a role-context transition.
        // Only participantRole changes; markAsRead remains the reset mechanism.
        return manager.save(ConversationParticipant, participant);
      }
      return participant;
    }

    const newParticipant = manager.create(ConversationParticipant, {
      conversationId,
      userId,
      participantRole,
      joinedAt: new Date(),
    });

    return manager.save(ConversationParticipant, newParticipant);
  }

  private async ensureUserHasRole(
    manager: EntityManager,
    userId: number,
    roleCode: RoleCode,
  ) {
    const user = await manager.findOne(Users, {
      where: { id: userId },
      relations: ['userRole', 'userRole.role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hasRole = user.userRole?.role.code === roleCode;

    if (!hasRole) {
      throw new ForbiddenException(`User must have ${roleCode} role`);
    }

    return user;
  }

  private async resolveSenderRole(
    manager: EntityManager,
    conversation: Conversation,
    senderId: number,
  ) {
    const sender = await manager.findOne(Users, {
      where: { id: senderId },
      relations: ['userRole', 'userRole.role'],
    });
    const roleCode = sender?.userRole?.role.code;

    if (roleCode === RoleCode.CUSTOMER) {
      if (conversation.customerId !== senderId) {
        throw new ForbiddenException('Cannot access this conversation');
      }
      return ConversationUserRole.CUSTOMER;
    }

    if (roleCode === RoleCode.ADMIN || roleCode === RoleCode.STAFF) {
      return ConversationUserRole.ADMIN;
    }

    throw new ForbiddenException('User must have a chat-enabled role');
  }

  private validateMessageBody(
    type = MessageType.TEXT,
    content?: string | null,
  ) {
    if (type === MessageType.TEXT && !content?.trim()) {
      throw new BadRequestException('Text message content is required');
    }
  }

  private findConversationWithLatestData(
    manager: EntityManager,
    conversationId: number,
  ) {
    return manager.findOne(Conversation, {
      where: { id: conversationId },
      relations: [
        'customer',
        'lastMessage',
        'participants',
        'participants.user',
      ],
    });
  }

  private async findConversationWithRelations(id: number) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'lastMessage',
        'participants',
        'participants.user',
      ],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  private getConversationRole(user: Users) {
    const roleCode = user.userRole?.role.code;

    if (roleCode === RoleCode.ADMIN || roleCode === RoleCode.STAFF) {
      return ConversationUserRole.ADMIN;
    }

    if (roleCode === RoleCode.CUSTOMER) {
      return ConversationUserRole.CUSTOMER;
    }

    throw new ForbiddenException('User must have customer or admin role');
  }

  private ensureCanViewConversation(
    conversation: Conversation,
    currentUser: Users,
  ) {
    const currentUserRole = this.getConversationRole(currentUser);

    if (
      currentUserRole === ConversationUserRole.CUSTOMER &&
      conversation.customerId !== currentUser.id
    ) {
      throw new ForbiddenException('Cannot access this conversation');
    }
  }

  private toConversationResponse(conversation: Conversation | null) {
    if (!conversation) {
      return null;
    }

    return {
      id: conversation.id,
      title: conversation.title ?? null,
      customerId: conversation.customerId,
      customer: conversation.customer
        ? this.toUserSummary(conversation.customer)
        : null,
      lastMessage: conversation.lastMessage
        ? this.toMessageResponse(conversation.lastMessage)
        : null,
      lastMessageAt: conversation.lastMessageAt
        ? this.toIsoDate(conversation.lastMessageAt)
        : null,
      participants:
        conversation.participants?.map((participant) => ({
          id: participant.id,
          userId: participant.userId,
          participantRole: participant.participantRole,
          user: participant.user ? this.toUserSummary(participant.user) : null,
          joinedAt: participant.joinedAt,
          lastReadAt: participant.lastReadAt ?? null,
          createdAt: participant.createdAt,
          updatedAt: participant.updatedAt,
        })) ?? [],
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  private async toConversationListResponse(
    conversation: Conversation,
    currentUserId: number,
  ) {
    return {
      id: conversation.id,
      title:
        conversation.title ??
        conversation.customer?.fullName ??
        conversation.customer?.email ??
        null,
      customer: conversation.customer
        ? this.toUserSummary(conversation.customer)
        : null,
      lastMessage: conversation.lastMessage
        ? this.toListMessageResponse(conversation.lastMessage)
        : null,
      lastMessageAt: conversation.lastMessageAt
        ? this.toIsoDate(conversation.lastMessageAt)
        : null,
      unreadCount: await this.getUnreadCount(conversation, currentUserId),
    };
  }

  private toMessageResponse(message: Message) {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderRole: message.senderRole,
      sender: message.sender ? this.toUserSummary(message.sender) : undefined,
      type: message.type,
      content: message.content ?? null,
      createdAt: this.toIsoDate(message.createdAt),
      updatedAt: this.toIsoDate(message.updatedAt),
      deletedAt: message.deletedAt ? this.toIsoDate(message.deletedAt) : null,
    };
  }

  private toListMessageResponse(message: Message) {
    return {
      id: message.id,
      content: message.content ?? null,
      type: message.type,
      senderId: message.senderId,
      senderRole: message.senderRole,
      createdAt: this.toIsoDate(message.createdAt),
    };
  }

  private toIsoDate(value: Date | string) {
    if (value instanceof Date) {
      return value.toISOString();
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
  }

  private async getUnreadCount(
    conversation: Conversation,
    currentUserId: number,
  ) {
    const participant = conversation.participants?.find(
      (item) => item.userId === currentUserId,
    );

    // Durable unread stored on participant (incremented on customer message).
    if (participant) {
      return Math.max(0, participant.unreadCount ?? 0);
    }

    // Never joined: unanswered customer messages after the last staff reply.
    const lastStaffMessage = await this.messagesRepository
      .createQueryBuilder('message')
      .where('message.conversationId = :conversationId', {
        conversationId: conversation.id,
      })
      .andWhere('message.senderRole = :adminRole', {
        adminRole: ConversationUserRole.ADMIN,
      })
      .andWhere('message.deletedAt IS NULL')
      .orderBy('message.id', 'DESC')
      .getOne();

    const query = this.messagesRepository
      .createQueryBuilder('message')
      .where('message.conversationId = :conversationId', {
        conversationId: conversation.id,
      })
      .andWhere('message.senderRole = :customerRole', {
        customerRole: ConversationUserRole.CUSTOMER,
      })
      .andWhere('message.deletedAt IS NULL');

    if (lastStaffMessage) {
      query.andWhere('message.id > :lastStaffMessageId', {
        lastStaffMessageId: lastStaffMessage.id,
      });
    }

    return query.getCount();
  }

  private toUserSummary(user: Users) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName ?? null,
      avatar: user.avatar ?? null,
    };
  }
}
