import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Products } from "../../products/entity/products.entity";

@Entity()
export class ProductStocks {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Products, (product) => product.id)
    @JoinColumn({ name: "productId" })
    productId: number;

    @Column()
    quantity: number;

    @Column()
    minQuantity: number;
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}