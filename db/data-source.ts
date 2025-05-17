import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  // host: process.env.DB_HOST,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  entities: ['dist/**/*.entity{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
