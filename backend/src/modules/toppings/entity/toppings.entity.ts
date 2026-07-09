import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryToppings } from '../../category-topppings/entity/category-toppings.entity';
import { OrderItemToppings } from '../../orders/entity/order-item-toppings';

@Entity()
export class Toppings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  price: number;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(
    () => CategoryToppings,
    (categoryTopping) => categoryTopping.topping,
  )
  categoryToppings: CategoryToppings[];

  @OneToMany(
    () => OrderItemToppings,
    (orderItemTopping) => orderItemTopping.topping,
    {
      nullable: false,
    },
  )
  orderItemToppings: OrderItemToppings[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
