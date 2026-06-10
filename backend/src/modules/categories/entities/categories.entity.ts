import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from '../../products/entity/products.entity';
import { CategoryToppings } from '../../category-topppings/entity/category-toppings.entity';

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryName: string;

  @Column({ default: '' })
  description: string;

  @Column({
    default: CategoryStatus.ACTIVE,
    enum: CategoryStatus,
    type: 'enum',
  })
  status: CategoryStatus;

  @OneToMany(() => Products, (product) => product.categoryId)
  products: Products[];

  @OneToMany(
    () => CategoryToppings,
    (categoryTopping) => categoryTopping.category,
  )
  categoryToppings: CategoryToppings[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
