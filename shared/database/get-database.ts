import * as SQLite from 'expo-sqlite';
import runOnce from '@/shared/utils/run-once';

const DB_NAME = 'app';

const initializeTables = async (database: SQLite.SQLiteDatabase) => {
  // Speed up the creation of tables. See -> https://docs.expo.dev/versions/latest/sdk/sqlite/#executing-pragma-queries
  await database.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS users (
        id    INTEGER PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        name  TEXT NOT NULL
      );
    `);
};

const runMigrationsOnce = runOnce(initializeTables); // TODO по идее тут должен быть механизм миграции и контроль текущей схемы в БД.

const getDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await runMigrationsOnce(db);
  return db;
};

export type GetDatabase = typeof getDatabase;

export default getDatabase;
