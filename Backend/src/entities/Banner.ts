import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("banners")
export class Banner {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    image_url!: string;

    @Column("boolean", { default: true })
    is_active!: boolean;

    @Column("int", { default: 0 })
    sort_order!: number;
}
