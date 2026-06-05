import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Products } from "../../products/entity/products.entity";

export enum CategoryStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoryName: string;

    @Column({ default: "" })
    description: string;

    @Column({
        default: CategoryStatus.ACTIVE,
        enum: CategoryStatus,
        type: "enum",
    })
    status: CategoryStatus;

    @OneToMany(() => Products, (product) => product.categoryId)
    products: Products[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
