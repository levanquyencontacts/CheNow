import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Toppings } from '../../toppings/entity/toppings.entity';
import { CartItems } from './cart-item.entity';

@Entity('cart_item_toppings')
@Index(['cartItemId', 'toppingId'], { unique: true })
@Index(['cartItemId'])
@Index(['toppingId'])
export class CartItemToppings {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CartItems, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cartItemId' })
  cartItem: CartItems;

  @Column()
  cartItemId: number;

  @ManyToOne(() => Toppings, { nullable: false })
  @JoinColumn({ name: 'toppingId' })
  topping: Toppings;

  @Column()
  toppingId: number;
}
