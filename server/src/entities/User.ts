import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "email"})
    email: string;

    @Column({name: "password"})
    password: string;

    @Column({name: "userName"})
    userName: string;

    @Column({name: "superUser"})
    superUser: number

}