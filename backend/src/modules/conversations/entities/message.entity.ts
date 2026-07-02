import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ConversationUserRole,
  MessageType,
} from '../../../common/enums/common.enum';
import { Users } from '../../users/users.entities';
import { Conversation } from './conversation.entity';

@Entity('messages')
@Index(['conversationId', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conversationId: number;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Index()
  @Column()
  senderId: number;

  @ManyToOne(() => Users, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: Users;

  @Column({
    type: 'enum',
    enumName: 'conversation_user_role_enum',
    enum: Object.values(ConversationUserRole),
  })
  senderRole: ConversationUserRole;

  @Column({
    type: 'enum',
    enumName: 'message_type_enum',
    enum: Object.values(MessageType),
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Column({ type: 'text', nullable: true })
  content?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date | null;
}
