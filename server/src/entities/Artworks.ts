import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Storages } from "./Storages";
import { Cells } from "./Cells";
import { Positions } from "./Positions";

@Entity()
export class Artworks extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    artist: string;

    @Column()
    technique: string;

    @Column()
    dimensions: string;

    @Column()
    price: number;

    @Column()
    notes: string;

    @Column()
    storageLocation: string;

    @Column()
    cell: string;

    @Column()
    position: number;

    @Column()
    image_url: string;

    @Column()
    image_key: string;

    @Column()
    download_url: string;

    @Column()
    download_key: string;

    @Column()
    by_user: string;

    @Column()
    storage_id: number

    @Column()
    cell_id: number

    @Column()
    position_id: number

    @ManyToOne(() => Storages, storage => storage.artworks)
    @JoinColumn({ name: "storage_id" })
    storage: Storages;

    @ManyToOne(() => Cells, cell => cell.artworks)
    @JoinColumn({ name: "cell_id" })
    cell_t: Cells;

    @OneToOne(() => Positions, position => position.artwork)
    @JoinColumn({ name: "position_id" })
    position_t: Positions;



}

