import { asc, desc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { categories, posts } from '@/lib/db/schema';
import { slugify } from '@/lib/slug';

export type PostFrontmatter = {
  id: number;
  title: string;
  description: string;
  date: string;
  slug: string;
  category: string;
  coverImage: string | null;
  schemaJson: string | null;
};

export type Post = PostFrontmatter & {
  content: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type PostRecord = {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  categoryId: number;
  categoryName: string;
  coverImage: string | null;
  schemaJson: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

const mapPost = (row: {
  posts: typeof posts.$inferSelect;
  categories: typeof categories.$inferSelect;
}): Post => {
  return {
    id: row.posts.id,
    title: row.posts.title,
    description: row.posts.description,
    date: row.posts.publishedAt,
    slug: row.posts.slug,
    category: row.categories.name,
    coverImage: row.posts.coverImage,
    schemaJson: row.posts.schemaJson,
    content: row.posts.content,
  };
};

const mapRecord = (row: {
  posts: typeof posts.$inferSelect;
  categories: typeof categories.$inferSelect;
}): PostRecord => {
  return {
    id: row.posts.id,
    slug: row.posts.slug,
    title: row.posts.title,
    description: row.posts.description,
    content: row.posts.content,
    categoryId: row.posts.categoryId,
    categoryName: row.categories.name,
    coverImage: row.posts.coverImage,
    schemaJson: row.posts.schemaJson,
    publishedAt: row.posts.publishedAt,
    createdAt: row.posts.createdAt,
    updatedAt: row.posts.updatedAt,
  };
};

/**
 * Returns all posts, newest first.
 */
export const getAllPosts = (): Post[] => {
  const rows = getDb()
    .select()
    .from(posts)
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .orderBy(desc(posts.publishedAt))
    .all();

  return rows.map(mapPost);
};

/**
 * Loads a single post by slug.
 */
export const getPostBySlug = (slug: string): Post | undefined => {
  const row = getDb()
    .select()
    .from(posts)
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.slug, slug))
    .get();

  return row ? mapPost(row) : undefined;
};

/**
 * Loads a post by numeric id for the admin editor.
 */
export const getPostById = (id: number): PostRecord | undefined => {
  const row = getDb()
    .select()
    .from(posts)
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.id, id))
    .get();

  return row ? mapRecord(row) : undefined;
};

/**
 * Returns every post row for the admin list.
 */
export const listAdminPosts = (): PostRecord[] => {
  const rows = getDb()
    .select()
    .from(posts)
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .orderBy(desc(posts.updatedAt))
    .all();

  return rows.map(mapRecord);
};

/**
 * Returns all categories, name-sorted.
 */
export const listCategories = (): Category[] => {
  return getDb().select().from(categories).orderBy(asc(categories.name)).all();
};

/**
 * Creates a category or returns the existing one with the same name.
 */
export const createCategory = (name: string) => {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    throw new Error('Kategoriename ist zu kurz.');
  }

  const existing = getDb().select().from(categories).where(eq(categories.name, trimmed)).get();
  if (existing) {
    return existing;
  }

  const base = slugify(trimmed) || 'kategorie';
  let slug = base;
  let index = 2;
  while (getDb().select().from(categories).where(eq(categories.slug, slug)).get()) {
    slug = `${base}-${index}`;
    index += 1;
  }

  return getDb()
    .insert(categories)
    .values({
      name: trimmed,
      slug,
      createdAt: new Date().toISOString(),
    })
    .returning()
    .get();
};

export type UpsertPostInput = {
  title: string;
  slug: string;
  description: string;
  content: string;
  categoryId: number;
  coverImage: string | null;
  schemaJson: string | null;
  publishedAt: string;
};

/**
 * Inserts a published post.
 */
export const createPost = (input: UpsertPostInput) => {
  const now = new Date().toISOString();
  return getDb()
    .insert(posts)
    .values({
      ...input,
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .get();
};

/**
 * Updates an existing post.
 */
export const updatePost = (id: number, input: UpsertPostInput) => {
  return getDb()
    .update(posts)
    .set({
      ...input,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(posts.id, id))
    .returning()
    .get();
};

/**
 * Deletes a post by id.
 */
export const deletePost = (id: number) => {
  getDb().delete(posts).where(eq(posts.id, id)).run();
};

/**
 * True when another post already uses the slug.
 */
export const slugTaken = (slug: string, exceptId?: number) => {
  const row = getDb().select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).get();
  if (!row) {
    return false;
  }
  return exceptId === undefined ? true : row.id !== exceptId;
};
