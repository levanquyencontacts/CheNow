// src/modules/users/entity/users.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { UserAddress } from '../../user-addresses/entity/user-address.entity';
import {
  CustomerGender,
  CustomerRank,
  UserRole,
} from '../../../common/enums/common.enum';
import type { UserRoleEntity } from '../../roles/entity/role.entity';

export { CustomerGender, CustomerRank, UserRole };

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  password: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string | null;

  @OneToOne(() => CustomerProfile, (profile) => profile.user)
  customerProfile?: Relation<CustomerProfile>;

  @OneToMany('UserAddress', 'user')
  addresses?: Relation<UserAddress[]>;

  @OneToMany('UserRoleEntity', 'user')
  userRoles?: Relation<UserRoleEntity[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('customer_profiles')
export class CustomerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user) => user.customerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<Users>;

  @Column({ unique: true })
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string | null;

  @Column({ type: 'date', nullable: true })
  birthday?: string | null;

  @Column({
    type: 'enum',
    enum: CustomerGender,
    nullable: true,
  })
  gender?: CustomerGender | null;

  @Column({ default: 0 })
  points: number;

  @Column({
    type: 'enum',
    enum: CustomerRank,
    default: CustomerRank.BRONZE,
  })
  rank: CustomerRank;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

