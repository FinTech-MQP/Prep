import { DataSource } from "typeorm";
import 'dotenv/config';

declare global {
  var datasource: DataSource | undefined;
}

export * from "./entity";

export const datasource = global.datasource || new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["entity/*.js"],
  migrations: ["migrations/*.js"],
  logging: true,
  synchronize: true,
});

if (process.env.NODE_ENV !== "production") global.datasource = datasource;