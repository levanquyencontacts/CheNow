import 'reflect-metadata';
import { existsSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

const rootDir = process.cwd();
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile =
  nodeEnv === 'development' ? '.env.development' : `.env.${nodeEnv}`;
const envPath = resolve(rootDir, envFile);
const fallbackEnvPath = resolve(rootDir, '.env');

dotenv.config({
  path: existsSync(envPath) ? envPath : fallbackEnvPath,
  override: true,
});

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5433),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  migrationsTableName: 'migrations',
  entities: [
    'src/**/*.entity{.ts,.js}',
    'src/**/*.entities{.ts,.js}',
    'src/modules/**/entity/*{.ts,.js}',
    'dist/**/*.entity.js',
    'dist/**/*.entities.js',
    'dist/modules/**/entity/*.js',
  ],
  migrations: [
    'src/database/migrations/dev/*{.ts,.js}',
    'dist/database/migrations/dev/*.js',
  ],
});

export default dataSource;
