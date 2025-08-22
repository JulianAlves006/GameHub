import "reflect-metadata";
import * as entities from "./api/entities/index.ts";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "gameHubDB",
    entities: Object.values(entities),
    synchronize: true,
    logging: false,
    subscribers: [],
    migrations: [],
});
