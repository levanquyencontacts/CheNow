import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { UserRole } from '../../../common/enums/common.enum';
import type { Users } from '../../users/entity/users.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    unique: true,
  })
  code: UserRole;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @OneToMany('UserRoleEntity', 'role')
  userRoles?: Relation<UserRoleEntity[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('user_roles')
@Unique(['userId', 'roleId'])
export class UserRoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Users', 'userRoles', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<Users>;

  @Column()
  userId: number;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Relation<Role>;

  @Column()
  roleId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
