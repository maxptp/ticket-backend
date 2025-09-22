import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from './snake-naming.strategy';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const envFilePath = process.env.ENV_FILE || '.env';
dotenv.config({ path: path.resolve(__dirname, '..', envFilePath) });

const entityPath =
  process.env.ENTITY_SOURCE === 'src'
    ? 'src/**/*.entity{.ts,.js}'
    : 'dist/**/*.entity{.ts,.js}';

const useSSL = process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  dropSchema: false,
  logging: ['query', 'error'],
  logger: 'file',
  entities: [entityPath],
  migrations: [`dist/db/migrations/*.{ts,js}`],
  namingStrategy: new SnakeNamingStrategy(),
  ssl: useSSL
    ? {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ap-southeast-1-bundle.pem').toString(),
      }
    : false, // disable SSL when not needed
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
