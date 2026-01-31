require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'primentoring',
  synchronize: false,
  logging: false,
  entities: [
    'dist/src/**/*.entity.js',
    'src/**/*.entity.ts',
  ],
  migrations: [ 'src/database/migrations/*.ts'],
  migrationsRun: true,
};
