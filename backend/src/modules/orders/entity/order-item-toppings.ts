import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Toppings } from '../../toppings/entity/toppings.entity';
import { OrderItems } from './order-items';

@Entity('order_item_toppings')
export class OrderItemToppings {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderItems, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItems;

  @Column()
  orderItemId: number;

  @ManyToOne(() => Toppings, { nullable: false })
  @JoinColumn({ name: 'toppingId' })
  topping: Toppings;

  @Column()
  toppingId: number;

  @Column()
  toppingName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;
}
