import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
