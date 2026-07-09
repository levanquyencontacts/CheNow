import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerRank, Gender } from '../../../common/enums/common.enum';
import { Users } from '../../users/users.entities';

@Entity('customer_profiles')
export class CustomerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @OneToOne(() => Users, (user) => user.customerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({
    type: 'enum',
    enumName: 'customer_profile_gender_enum',
    enum: Object.values(Gender),
    nullable: true,
  })
  gender?: Gender | null;

  @Column({ default: 0 })
  points: number;

  @Column({
    type: 'enum',
    enumName: 'customer_profile_rank_enum',
    enum: Object.values(CustomerRank),
    default: CustomerRank.BRONZE,
  })
  rank: CustomerRank;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
