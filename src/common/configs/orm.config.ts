import { join } from 'path';

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const rootPath = join(__dirname, '../..');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  entities: [`${rootPath}/**/*.entity{.ts,.js}`],
  migrations: [`${rootPath}/migrations/*{.ts,.js}`],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.LOG_DB_OPERATIONS === 'true',
  namingStrategy: new SnakeNamingStrategy(),
});
