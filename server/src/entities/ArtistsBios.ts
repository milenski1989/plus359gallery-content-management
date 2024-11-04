import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import { Artists } from "./Artists";

@Entity()
export class ArtistsBios extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 10000 })
    bio: string;

    @OneToOne(() => Artists)
    @JoinColumn()
    artist: Artists
}