import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Category } from "./Category.js";
import { ProductVariant } from "./ProductVariant.js";
import { OrderItem } from "./OrderItem.js";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("varchar")
    name!: string;

    @Column("text", { nullable: true })
    description!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    @Column("int", { nullable: true })
    category_id!: number;

    @Column("text", { nullable: true })
    image_url!: string;

    @Column("boolean", { default: false })
    is_featured!: boolean;

    @Column("varchar", { default: "active" })
    status!: string;

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @ManyToOne("Category", "products")
    @JoinColumn({ name: "category_id" })
    category!: any;

    @OneToMany("ProductVariant", "product")
    variants!: any[];

    @OneToMany("OrderItem", "product")
    orderItems!: any[];
}
