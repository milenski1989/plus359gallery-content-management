import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Storages } from "./Storages";
import { Positions } from "./Positions";
import { Artworks } from "./Artworks";

@Entity()
export class Cells extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    storage_id: number

    @ManyToOne(() => Storages, storage => storage.cells)
    @JoinColumn({ name: "storage_id" })
    storage: Storages;
    
    @OneToMany(() => Positions, position => position.cell)
    positions: Positions[];

    @OneToMany(() => Artworks, artwork => artwork.cell_t)
    artworks: Artworks[];
}