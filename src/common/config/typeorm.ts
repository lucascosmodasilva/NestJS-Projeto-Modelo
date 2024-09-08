import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { SeederOptions } from 'typeorm-extension';
import { User } from 'src/user/entities/user.entity';
import { Token } from 'src/token/entities/token.entity';
import { User1725680182035 } from '../migrations/1725680182035-user';
import { Token1725680182036 } from '../migrations/1725680182036-token';

dotenvConfig({ path: '.env' });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'contifier',
  schema: process.env.DB_SCHEMA || 'public',
  entities: [
    User,
    Token,
  ],
  migrations: [
    User1725680182035,
    Token1725680182036,
  ],
  synchronize: false,
  migrationsRun: true,
  logging: false,
} as DataSourceOptions & SeederOptions);

export default dataSource;
