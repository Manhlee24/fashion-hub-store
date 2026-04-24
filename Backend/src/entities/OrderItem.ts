import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Order } from "./Order.js";
import { Product } from "./Product.js";

@Entity("order_items")
export class OrderItem {
    @PrimaryColumn("int")
    order_id!: number;

    @PrimaryColumn("int")
    product_id!: number;

    @Column("int")
    quantity!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    unit_price!: number;

    @Column("varchar", { nullable: true })
    size!: string;

    @ManyToOne("Order", "items")
    @JoinColumn({ name: "order_id" })
    order!: any;

    @ManyToOne("Product", "orderItems")
    @JoinColumn({ name: "product_id" })
    product!: any;
}
