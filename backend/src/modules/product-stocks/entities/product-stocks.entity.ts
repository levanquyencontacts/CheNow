import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
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

  @OneToOne(() => Products, (product) => product.productStocks)
  @JoinColumn({ name: 'productId' })
  product: Products;

  @Column()
  quantity: number;

  @Column()
  minQuantity: number;
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
