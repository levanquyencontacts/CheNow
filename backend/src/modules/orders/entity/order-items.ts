import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategorySizes } from '../../category-sizes/entity/category-sizes.entity';
import { Products } from '../../products/entity/products.entity';
import { Orders } from './orders.entity';
import { OrderItemToppings } from './order-item-toppings';

@Entity('order_items')
export class OrderItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Orders, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Orders;

  @Column()
  orderId: number;

  @ManyToOne(() => Products, (product) => product.orderItems, {
    nullable: false,
  })
  @JoinColumn({ name: 'productId' })
  product: Products;

  @Column()
  productId: number;

  @ManyToOne(() => CategorySizes, { nullable: false })
  @JoinColumn({ name: 'categorySizeId' })
  categorySize: CategorySizes;

  @Column()
  categorySizeId: number;

  @Column()
  productName: string;

  @Column()
  sizeName: string;

  @Column()
  sizeCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  sizeExtraPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'text', nullable: true })
  note?: string | null;

  @OneToMany(
    () => OrderItemToppings,
    (orderItemTopping) => orderItemTopping.orderItem,
  )
  orderItemToppings: OrderItemToppings[];
}
