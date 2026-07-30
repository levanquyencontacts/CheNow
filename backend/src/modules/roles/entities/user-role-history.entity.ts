import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../users/users.entities';
import { Role } from './role.entity';

@Entity('user_role_histories')
export class UserRoleHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  actorId: number;

  @Column({ nullable: true })
  oldRoleId: number | null;

  @Column()
  newRoleId: number;

  @ManyToOne(() => Users, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Users, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'actorId' })
  actor: Users;

  @ManyToOne(() => Role, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'oldRoleId' })
  oldRole: Role | null;

  @ManyToOne(() => Role, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'newRoleId' })
  newRole: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
