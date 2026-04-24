import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Order } from "./Order.js";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("varchar")
    name!: string;

    @Column("varchar", { unique: true })
    email!: string;

    @Column("varchar")
    password!: string;

    @Column("varchar", { default: "customer" })
    role!: string;

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @OneToMany("Order", "user")
    orders!: any[];

    @Column("varchar", { nullable: true })
    reset_token!: string | null;

    @Column("datetime", { nullable: true })
    reset_token_expiry!: Date | null;
}
