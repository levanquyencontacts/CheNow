import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from '../../products/entity/products.entity';

@Entity()
export class ProductStocks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => Products, (product) => product.productStocks)
  @JoinColumn({ name: 'productId' })
  product: Products;

  @Column()
  quantity: number;

  @Column()
  minQuantity: number;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
