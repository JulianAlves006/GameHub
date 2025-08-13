import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { Team } from "./entities/Team.js";
import { Award } from "./entities/Award.js";
import { Championship } from "./entities/Championship.js";
import { AwardsChampionship } from "./entities/AwardsChampionship.js";
import { Match } from "./entities/Match.js";
import { Gamer } from "./entities/Gamer.js";
import { Log } from "./entities/Log.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "gameHubDB",
    entities: [User, Team, Award, Championship, AwardsChampionship, Match, Gamer, Log],
    synchronize: true,
    logging: false,
    subscribers: [],
    migrations: [__dirname + "/migrations/*.ts"],
});
