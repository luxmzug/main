import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: text('created_at').notNull(),
});

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  coverImage: text('cover_image'),
  coverAlt: text('cover_alt'),
  showCoverOnDetail: integer('show_cover_on_detail', { mode: 'boolean' }).notNull().default(false),
  schemaJson: text('schema_json'),
  publishedAt: text('published_at').notNull(),
  status: text('status').notNull().default('published'),
  queuePosition: integer('queue_position'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tokenHash: text('token_hash').notNull().unique(),
  ipHash: text('ip_hash').notNull(),
  uaHash: text('ua_hash').notNull(),
  expiresAt: integer('expires_at').notNull(),
  lastRotatedAt: integer('last_rotated_at').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const loginAttempts = sqliteTable('login_attempts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ipHash: text('ip_hash').notNull(),
  attemptedAt: integer('attempted_at').notNull(),
  success: integer('success').notNull(),
});
