import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Artworks } from "./Artworks";
import { Cells } from "./Cells";

@Entity()
export class Storages extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Artworks, artwork => artwork.storage)
    artworks: Artworks[];

    @OneToMany(() => Cells, cell => cell.storage)
    cells: Cells[];
}

