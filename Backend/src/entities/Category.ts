import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Product } from "./Product.js";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("varchar")
    name!: string;

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @OneToMany("Product", "category")
    products!: any[];
}
