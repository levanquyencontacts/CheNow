
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "../../categories/entities/categories.entity";

@Entity()
export class Products {
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({ name: "categoryId" })
    category: Category
    @Column()
    categoryId: number
    @Column()
    productName: string
    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number
    @Column({ nullable: true })
    imageUrl: string
    @Column({ nullable: true, type: "text" })
    description: string
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date

}