import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/categories.entity';
import { Toppings } from '../../toppings/entity/toppings.entity';

@Entity()
export class CategoryToppings {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Toppings, (topping) => topping)
  @JoinColumn({ name: 'toppingId' })
  topping: Toppings;

  @Column()
  categoryId: number;

  @Column()
  toppingId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
