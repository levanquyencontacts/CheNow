import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/users.entities';
import {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '../../../common/enums/common.enum';
import { OrderItems } from './order-items';

@Entity('orders')
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true, unique: true })
  invoiceCode?: string;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  userId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  orderType: OrderType;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  receiverName?: string;

  @Column({ nullable: true })
  receiverPhone?: string;

  @Column({ nullable: true, type: 'text' })
  deliveryAddress?: string;

  @Column({ nullable: true, type: 'text' })
  note?: string;
  @OneToMany(() => OrderItems, (orderItems) => orderItems.order)
  orderItems: OrderItems[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
