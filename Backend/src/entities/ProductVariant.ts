import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product.js";

@Entity("product_variants")
export class ProductVariant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("int")
    product_id!: number;

    @Column("varchar")
    size!: string;

    @Column("int", { default: 0 })
    stock!: number;

    @ManyToOne(() => Product, (product: Product) => product.variants)
    @JoinColumn({ name: "product_id" })
    product!: Product;
}
