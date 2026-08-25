import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { getEnv } from '@/lib/Env';
import * as schema from '@/lib/db/schema';
import { seedIfEmpty } from '@/lib/db/seed';
import { viennaLocalToUtcIso } from '@/lib/vienna-time';

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
  cover_alt TEXT,
  show_cover_on_detail INTEGER NOT NULL DEFAULT 0,
  schema_json TEXT,
  published_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  queue_position INTEGER,
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
CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_login_ip_time ON login_attempts(ip_hash, attempted_at);
`;

type AppDb = ReturnType<typeof drizzle<typeof schema>>;

let sqlite: Database.Database | undefined;
let db: AppDb | undefined;

const ensurePostColumns = (connection: Database.Database) => {
  const cols = connection.prepare('PRAGMA table_info(posts)').all() as { name: string }[];
  const names = new Set(cols.map((col) => col.name));
  if (!names.has('show_cover_on_detail')) {
    connection.exec(
      'ALTER TABLE posts ADD COLUMN show_cover_on_detail INTEGER NOT NULL DEFAULT 0',
    );
  }
  if (!names.has('cover_alt')) {
    connection.exec('ALTER TABLE posts ADD COLUMN cover_alt TEXT');
  }
  if (!names.has('status')) {
    connection.exec("ALTER TABLE posts ADD COLUMN status TEXT NOT NULL DEFAULT 'published'");
  }
  if (!names.has('queue_position')) {
    connection.exec('ALTER TABLE posts ADD COLUMN queue_position INTEGER');
  }

  connection.exec(
    "UPDATE posts SET status = 'published' WHERE status IS NULL OR status = ''",
  );

  const legacyDates = connection
    .prepare('SELECT id, published_at FROM posts WHERE length(published_at) = 10')
    .all() as { id: number; published_at: string }[];

  if (legacyDates.length > 0) {
    const update = connection.prepare('UPDATE posts SET published_at = ? WHERE id = ?');
    for (const row of legacyDates) {
      update.run(viennaLocalToUtcIso(row.published_at, 9, 0), row.id);
    }
  }
};

/**
 * Returns the shared SQLite/Drizzle connection, creating schema and seeding on first use.
 */
export const getDb = (): AppDb => {
  if (!sqlite) {
    const env = getEnv();
    const dbPath = path.isAbsolute(env.DATABASE_PATH)
      ? env.DATABASE_PATH
      : path.join(/* turbopackIgnore: true */ process.cwd(), env.DATABASE_PATH);

    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('foreign_keys = ON');
    sqlite.exec(CREATE_SQL);
  }

  ensurePostColumns(sqlite);

  if (!db) {
    db = drizzle(sqlite, { schema });
    seedIfEmpty(db);
  }

  return db;
};
