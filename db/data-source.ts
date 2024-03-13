import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  // @ts-expect-error remake
  port: process.env.DATABASE_PORT || 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  migrationsTableName: 'Migrations',
  migrationsRun: true,
  synchronize: false
};
console.log(dataSourceOptions);
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
