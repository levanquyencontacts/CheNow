import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationUserRole } from '../../../common/enums/common.enum';
import { Users } from '../../users/users.entities';
import { Conversation } from './conversation.entity';

@Entity('conversation_participants')
@Unique(['conversationId', 'userId'])
export class ConversationParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  conversationId: number;

  @ManyToOne(() => Conversation, (conversation) => conversation.participants, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Index()
  @Column()
  userId: number;

  @ManyToOne(() => Users, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({
    type: 'enum',
    enumName: 'conversation_user_role_enum',
    enum: Object.values(ConversationUserRole),
  })
  participantRole: ConversationUserRole;

  @Column({ type: 'timestamptz' })
  joinedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastReadAt?: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
