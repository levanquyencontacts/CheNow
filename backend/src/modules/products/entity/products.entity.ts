import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/categories.entity';
import { ProductStocks } from '../../product-stocks/entities/product-stocks.entity';
import { OrderItems } from '../../orders/entity/order-items';
import { ProductStatus } from '../../../common/enums/common.enum';

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Category, (category) => category.id)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
  @OneToOne(() => ProductStocks, (productStock) => productStock.product)
  productStocks: ProductStocks;
  @Column()
  categoryId: number;
  @Column()
  productName: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  @Column({ nullable: true })
  imageUrl: string;
  @Column({ nullable: true, type: 'text' })
  description: string;
  @Column({
    type: 'enum',
    enumName: 'products_status_enum',
    enum: Object.values(ProductStatus),
    default: ProductStatus.ACTIVE,
  })
  status: ProductStatus;
  @OneToMany(() => OrderItems, (orderItem) => orderItem.product, {
    nullable: false,
  })
  orderItems: OrderItems[];
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
