import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("hero_sections")
export class Hero {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    image_url!: string;

    @Column("varchar", { nullable: true })
    title!: string;

    @Column("text", { nullable: true })
    subtitle!: string;

    @Column("varchar", { nullable: true })
    button_text!: string;

    @Column("varchar", { nullable: true })
    button_link!: string;

    @Column("boolean", { default: true })
    is_active!: boolean;

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;
}
