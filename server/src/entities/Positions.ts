import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Storages } from "./Storages";
import { Cells } from "./Cells";
import { Artworks } from "./Artworks";

@Entity()
export class Positions extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    cell_id: number

    @ManyToOne(() => Cells, cell => cell.positions)
    @JoinColumn({ name: "cell_id" })
    cell: Cells;

    @OneToOne(() => Artworks, artwork => artwork.position)
    @JoinColumn({name: 'id'})
    artwork: Artworks;
}