import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Artists extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 45 })
    artist: string;
}