import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./User.js";
import { OrderItem } from "./OrderItem.js";

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("int")
    user_id!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    total_amount!: number;

    @Column("varchar", { default: "pending" })
    status!: string;

    @Column("text", { nullable: true })
    address!: string;

    @Column("varchar", { nullable: true })
    phone!: string;

    @Column("varchar", { nullable: true })
    receiver_name!: string;

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @ManyToOne("User", "orders")
    @JoinColumn({ name: "user_id" })
    user!: any;

    @OneToMany("OrderItem", "order")
    items!: any[];
}
