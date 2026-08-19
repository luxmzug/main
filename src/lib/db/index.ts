import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { getEnv } from '@/lib/Env';
import * as schema from '@/lib/db/schema';
import { seedIfEmpty } from '@/lib/db/seed';

const CREATE_SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  cover_image TEXT,
  schema_json TEXT,
  published_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  ip_hash TEXT NOT NULL,
  ua_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  last_rotated_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash TEXT NOT NULL,
  attempted_at INTEGER NOT NULL,
  success INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_login_ip_time ON login_attempts(ip_hash, attempted_at);
`;

type AppDb = ReturnType<typeof drizzle<typeof schema>>;

let sqlite: Database.Database | undefined;
let db: AppDb | undefined;

/**
 * Returns the shared SQLite/Drizzle connection, creating schema and seeding on first use.
 */
export const getDb = (): AppDb => {
  if (db) {
    return db;
  }

  const env = getEnv();
  const dbPath = path.isAbsolute(env.DATABASE_PATH)
    ? env.DATABASE_PATH
    : path.join(/* turbopackIgnore: true */ process.cwd(), env.DATABASE_PATH);

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.exec(CREATE_SQL);

  db = drizzle(sqlite, { schema });
  seedIfEmpty(db);

  return db;
};
