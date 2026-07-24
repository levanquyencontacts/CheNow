import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/users.entities';

@Entity('user_addresses')
@Index('IDX_user_addresses_userId', ['userId'])
@Index('UQ_user_addresses_one_default_per_user', ['userId'], {
  unique: true,
  where: '"isDefault" = true',
})
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => Users, (user) => user.addresses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({ length: 50 })
  label: string;

  @Column({ length: 100 })
  receiverName: string;

  @Column({ length: 20 })
  receiverPhone: string;

  @Column({ type: 'varchar', length: 500 })
  fullAddress: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
