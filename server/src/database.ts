import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { User } from "./entities/User";
import { Artworks } from "./entities/Artworks";
import { Artists } from "./entities/Artists";
import { ArtistsBios } from "./entities/ArtistsBios";
import { Storages } from "./entities/Storages";
import { Cells } from "./entities/Cells";
import { Positions } from "./entities/Positions";
dotenv.config()

export const dbConnection = new DataSource({
        type: 'mysql',
        username: process.env.MYSQL_USER,
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        logging: true,
        synchronize: false,
        entities: [
            User, Artworks, Artists, ArtistsBios, Storages, Cells, Positions
        ]
    })

    dbConnection
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })