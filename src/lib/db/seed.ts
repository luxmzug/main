import fs from 'node:fs';
import path from 'node:path';
import { count, eq } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import matter from 'gray-matter';
import { marked } from 'marked';
import { categories, posts } from '@/lib/db/schema';
import * as schema from '@/lib/db/schema';
import { slugify } from '@/lib/slug';

type AppDb = BetterSQLite3Database<typeof schema>;

const contentDirectory = path.join(/* turbopackIgnore: true */ process.cwd(), 'content/blog');

/**
 * Imports existing MDX posts into SQLite when the posts table is empty.
 */
export const seedIfEmpty = (db: AppDb) => {
  const existing = db.select({ value: count() }).from(posts).get();
  if (existing && existing.value > 0) {
    return;
  }

  if (!fs.existsSync(contentDirectory)) {
    return;
  }

  const files = fs.readdirSync(contentDirectory).filter((file) => file.endsWith('.mdx'));
  const now = new Date().toISOString();

  for (const filename of files) {
    const raw = fs.readFileSync(path.join(contentDirectory, filename), 'utf8');
    const parsed = matter(raw);
    const title = typeof parsed.data.title === 'string' ? parsed.data.title : filename;
    const description =
      typeof parsed.data.description === 'string' ? parsed.data.description : '';
    const date = typeof parsed.data.date === 'string' ? parsed.data.date : now.slice(0, 10);
    const slug =
      typeof parsed.data.slug === 'string' ? parsed.data.slug : filename.replace(/\.mdx$/, '');
    const categoryName =
      typeof parsed.data.category === 'string' ? parsed.data.category : 'Ratgeber';
    const html = marked.parse(parsed.content, { async: false }) as string;

    let category = db.select().from(categories).where(eq(categories.name, categoryName)).get();
    if (!category) {
      category = db
        .insert(categories)
        .values({
          name: categoryName,
          slug: uniqueCategorySlug(db, slugify(categoryName) || 'kategorie'),
          createdAt: now,
        })
        .returning()
        .get();
    }

    db.insert(posts)
      .values({
        slug,
        title,
        description,
        content: html,
        categoryId: category.id,
        coverImage: null,
        showCoverOnDetail: false,
        schemaJson: null,
        publishedAt: date,
        createdAt: now,
        updatedAt: now,
      })
      .run();
  }
};

const uniqueCategorySlug = (db: AppDb, base: string) => {
  let slug = base;
  let index = 2;
  while (db.select().from(categories).where(eq(categories.slug, slug)).get()) {
    slug = `${base}-${index}`;
    index += 1;
  }
  return slug;
};
