import * as SQLite from 'expo-sqlite';
import runOnce from '@/shared/utils/run-once';

const DB_NAME = 'app';

const initializeTables = async (database: SQLite.SQLiteDatabase) => {
  // PRAGMA journal_mode = WAL -> Speed up the creation of tables. See -> https://docs.expo.dev/versions/latest/sdk/sqlite/#executing-pragma-queries
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id    INTEGER PRIMARY KEY NOT NULL,
      email TEXT NOT NULL,
      name  TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS comments (
      id              INTEGER PRIMARY KEY NOT NULL,
      message         TEXT NOT NULL,
      created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      reply_parent_id INTEGER,
      user_id         INTEGER NOT NULL,
      
      FOREIGN KEY (reply_parent_id) REFERENCES comments (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS comments_reply_parent_id_index ON comments (reply_parent_id);
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
