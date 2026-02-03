import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as entities from './src/api/entities/index.ts';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gameHubDB',
  entities: Object.values(entities),
  synchronize: false,
  logging: true,
  subscribers: [],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conectado ao banco de dados');

    const migrations = await AppDataSource.runMigrations();

    if (migrations.length === 0) {
      console.log('ℹ️  Nenhuma migration pendente');
    } else {
      console.log(
        `✅ ${migrations.length} migration(s) executada(s) com sucesso:`
      );
      migrations.forEach(migration => {
        console.log(`   - ${migration.name}`);
      });
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Erro ao executar migrations:', error);
    process.exit(1);
  }
}

runMigrations();
