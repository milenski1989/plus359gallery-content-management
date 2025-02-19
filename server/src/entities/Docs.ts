import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Docs extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    notes: string;

    @Column()
    download_url: string;

    @Column()
    download_key: string;

    @Column()
    by_user: string;
}

