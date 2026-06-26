import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Users } from '../../users/entity/users.entity';

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<Users>;

  @Column()
  userId: number;

  @Column()
  receiverName: string;

  @Column()
  receiverPhone: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
