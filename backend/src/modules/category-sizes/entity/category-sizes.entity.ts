import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/categories.entity';
import { Sizes } from './sizes.entity';

@Entity('category_sizes')
@Index(['sizeId', 'categoryId'], { unique: true })
export class CategorySizes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sizeId: number;

  @ManyToOne(() => Sizes, (size) => size.categorySizes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sizeId' })
  size: Sizes;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  extraPrice: number;

  @ManyToOne(() => Category, (category) => category.categorySizes)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
