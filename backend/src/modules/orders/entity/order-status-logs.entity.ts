import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../../../common/enums/common.enum';
import { Users } from '../../users/users.entities';
import { Orders } from './orders.entity';

@Entity('order_status_logs')
export class OrderStatusLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Orders, (order) => order.statusLogs, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Orders;

  @Column()
  orderId: number;

  @Column({
    enum: Object.values(OrderStatus),
    enumName: 'orders_status_enum',
    nullable: true,
    type: 'enum',
  })
  fromStatus: OrderStatus | null;

  @Column({
    enum: Object.values(OrderStatus),
    enumName: 'orders_status_enum',
    type: 'enum',
  })
  toStatus: OrderStatus;

  @Column({ nullable: true, type: 'text' })
  note?: string | null;

  @ManyToOne(() => Users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'changedByUserId' })
  changedByUser?: Users | null;

  @Column({ nullable: true })
  changedByUserId?: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
