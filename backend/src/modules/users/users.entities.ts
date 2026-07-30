// src/modules/user/entities/user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CustomerProfile } from '../customers/entities/customer-profile.entity';
import { UserRole } from '../roles/entities/user-role.entity';
import { UserAddress } from '../addresses/entity/user-address.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ select: false })
  password: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string | null;

  @OneToOne(() => UserRole, (userRole) => userRole.user)
  userRole: UserRole;

  @OneToOne(() => CustomerProfile, (customerProfile) => customerProfile.user)
  customerProfile?: CustomerProfile;

  @OneToMany(() => UserAddress, (address) => address.user)
  addresses: UserAddress[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
