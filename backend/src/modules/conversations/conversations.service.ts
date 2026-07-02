import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  MoreThan,
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
  SendCustomerMessageDto,
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
        'assignedAdmin',
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
        this.toConversationListResponse(conversation, currentUser),
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

    const { page = 1, limit = 30 } = query;
    const [items, total] = await this.messagesRepository.findAndCount({
      where: { conversationId: id },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
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

  async sendCustomerMessage(currentUser: Users, body: SendCustomerMessageDto) {
    this.validateMessageBody(body.type, body.content);

    return this.dataSource.transaction(async (manager) => {
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

      await this.createMessage(manager, conversation.id, {
        senderId: currentUser.id,
        senderRole: ConversationUserRole.CUSTOMER,
        type: body.type ?? MessageType.TEXT,
        content: body.content,
      });

      const latestConversation = await this.findConversationWithLatestData(
        manager,
        conversation.id,
      );

      return this.toConversationResponse(latestConversation);
    });
  }

  async sendMessage(
    conversationId: number,
    currentUser: Users,
    body: SendConversationMessageDto,
  ) {
    this.validateMessageBody(body.type, body.content);

    return this.dataSource.transaction(async (manager) => {
      const conversation = await this.ensureConversation(
        conversationId,
        manager,
      );
      const senderRole = await this.resolveSenderRole(
        manager,
        conversation,
        currentUser.id,
      );

      if (
        senderRole === ConversationUserRole.ADMIN &&
        conversation.assignedAdminId !== currentUser.id
      ) {
        throw new ForbiddenException(
          'Only assigned admin can send admin messages',
        );
      }

      await this.ensureParticipant(
        manager,
        conversation.id,
        currentUser.id,
        senderRole,
      );

      await this.createMessage(manager, conversation.id, {
        senderId: currentUser.id,
        senderRole,
        type: body.type ?? MessageType.TEXT,
        content: body.content,
      });

      const latestConversation = await this.findConversationWithLatestData(
        manager,
        conversation.id,
      );

      return this.toConversationResponse(latestConversation);
    });
  }

  async assign(conversationId: number, currentUser: Users) {
    return this.dataSource.transaction(async (manager) => {
      await this.ensureUserHasRole(manager, currentUser.id, RoleCode.ADMIN);

      const result = await manager
        .createQueryBuilder()
        .update(Conversation)
        .set({ assignedAdminId: currentUser.id })
        .where('id = :conversationId', { conversationId })
        .andWhere('assignedAdminId IS NULL')
        .execute();

      if (!result.affected) {
        const conversation = await manager.findOne(Conversation, {
          where: { id: conversationId },
        });

        if (!conversation) {
          throw new NotFoundException('Conversation not found');
        }

        throw new ConflictException('Conversation already assigned');
      }

      await this.ensureParticipant(
        manager,
        conversationId,
        currentUser.id,
        ConversationUserRole.ADMIN,
      );

      const latestConversation = await this.findConversationWithLatestData(
        manager,
        conversationId,
      );

      return this.toConversationResponse(latestConversation);
    });
  }

  async unassign(conversationId: number, currentUser: Users) {
    await this.ensureUserHasRole(
      this.dataSource.manager,
      currentUser.id,
      RoleCode.ADMIN,
    );

    const result = await this.conversationsRepository
      .createQueryBuilder()
      .update(Conversation)
      .set({ assignedAdminId: null })
      .where('id = :conversationId', { conversationId })
      .andWhere('assignedAdminId = :adminId', { adminId: currentUser.id })
      .execute();

    if (!result.affected) {
      const conversation = await this.conversationsRepository.findOne({
        where: { id: conversationId },
      });

      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }

      throw new ForbiddenException('Only assigned admin can unassign');
    }

    return this.findById(conversationId, currentUser);
  }

  async updateTitle(conversationId: number, currentUser: Users, title: string) {
    const conversation = await this.ensureConversation(conversationId);
    this.ensureCanViewConversation(conversation, currentUser);
    await this.conversationsRepository.update(conversationId, { title });

    return this.findById(conversationId, currentUser);
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

    return savedMessage;
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
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hasRole = user.userRoles?.some(
      (userRole) => userRole.role.code === roleCode,
    );

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
    if (conversation.customerId === senderId) {
      await this.ensureUserHasRole(manager, senderId, RoleCode.CUSTOMER);
      return ConversationUserRole.CUSTOMER;
    }

    await this.ensureUserHasRole(manager, senderId, RoleCode.ADMIN);
    return ConversationUserRole.ADMIN;
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
        'assignedAdmin',
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
        'assignedAdmin',
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
    const roleCodes = user.userRoles?.map((userRole) => userRole.role.code);

    if (roleCodes?.includes(RoleCode.ADMIN)) {
      return ConversationUserRole.ADMIN;
    }

    if (roleCodes?.includes(RoleCode.CUSTOMER)) {
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
      assignedAdminId: conversation.assignedAdminId ?? null,
      customer: conversation.customer
        ? this.toUserSummary(conversation.customer)
        : null,
      assignedAdmin: conversation.assignedAdmin
        ? this.toUserSummary(conversation.assignedAdmin)
        : null,
      lastMessage: conversation.lastMessage
        ? this.toMessageResponse(conversation.lastMessage)
        : null,
      lastMessageAt: conversation.lastMessageAt ?? null,
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
    currentUser: Users,
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
      assignedAdmin: conversation.assignedAdmin
        ? this.toUserSummary(conversation.assignedAdmin)
        : null,
      assignmentStatus: this.getAssignmentStatus(conversation, currentUser),
      assignmentText: this.getAssignmentText(conversation, currentUser),
      lastMessage: conversation.lastMessage
        ? this.toListMessageResponse(conversation.lastMessage)
        : null,
      lastMessageAt: conversation.lastMessageAt ?? null,
      unreadCount: await this.getUnreadCount(conversation, currentUser),
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
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      deletedAt: message.deletedAt ?? null,
    };
  }

  private toListMessageResponse(message: Message) {
    return {
      id: message.id,
      content: message.content ?? null,
      type: message.type,
      senderId: message.senderId,
      senderRole: message.senderRole,
      createdAt: message.createdAt,
    };
  }

  private getAssignmentStatus(conversation: Conversation, currentUser: Users) {
    if (!conversation.assignedAdminId) {
      return 'unassigned';
    }

    if (conversation.assignedAdminId === currentUser.id) {
      return 'assigned_to_me';
    }

    return 'assigned_to_other';
  }

  private getAssignmentText(conversation: Conversation, currentUser: Users) {
    const assignmentStatus = this.getAssignmentStatus(
      conversation,
      currentUser,
    );

    if (assignmentStatus === 'unassigned') {
      return 'Chưa có ai nhận';
    }

    if (assignmentStatus === 'assigned_to_me') {
      return 'Bạn đang xử lý';
    }

    const adminName =
      conversation.assignedAdmin?.fullName ??
      conversation.assignedAdmin?.email ??
      'admin khác';

    return `Đang xử lý bởi ${adminName}`;
  }

  private async getUnreadCount(conversation: Conversation, currentUser: Users) {
    const participant = conversation.participants?.find(
      (item) => item.userId === currentUser.id,
    );

    if (!participant) {
      return 0;
    }

    const where: FindOptionsWhere<Message> = {
      conversationId: conversation.id,
      senderId: Not(currentUser.id),
    };

    if (participant.lastReadAt) {
      where.createdAt = MoreThan(participant.lastReadAt);
    }

    return this.messagesRepository.count({ where });
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
