import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env'), override: true });

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  console.log('[Database]', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    passwordLength: process.env.DB_PASSWORD?.length,
    passwordMatchesExpected: process.env.DB_PASSWORD === 'chenow',
  });

  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5433'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    synchronize: process.env.DB_SYNCHRONIZE !== 'false',
    entities: [],
    // ssl:
    //   process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  };
};
