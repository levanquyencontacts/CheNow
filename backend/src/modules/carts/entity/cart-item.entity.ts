import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategorySizes } from '../../category-sizes/entity/category-sizes.entity';
import { Products } from '../../products/entity/products.entity';
import { Carts } from './cart.entity';
import { CartItemToppings } from './cart-item-topping.entity';

@Entity('cart_items')
@Index(['cartId'])
@Index(['productId'])
@Index(['categorySizeId'])
export class CartItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Carts, (cart) => cart.cartItems, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cartId' })
  cart: Carts;

  @Column()
  cartId: number;

  @ManyToOne(() => Products, { nullable: false })
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
  quantity: number;

  @Column({ nullable: true, type: 'text' })
  note?: string | null;

  @OneToMany(
    () => CartItemToppings,
    (cartItemTopping) => cartItemTopping.cartItem,
  )
  cartItemToppings: CartItemToppings[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
