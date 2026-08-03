import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/blog');

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  slug: string;
  category: string;
};

export type Post = PostFrontmatter & {
  content: string;
};

/**
 * Reads all MDX posts and sorts them by date (newest first).
 */
export const getAllPosts = (): Post[] => {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const files = fs.readdirSync(contentDirectory).filter((file) => file.endsWith('.mdx'));

  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(contentDirectory, filename), 'utf8');
      const { data, content } = matter(raw);
      const frontmatter = data as PostFrontmatter;

      return {
        title: frontmatter.title,
        description: frontmatter.description,
        date: frontmatter.date,
        slug: frontmatter.slug || filename.replace(/\.mdx$/, ''),
        category: frontmatter.category ?? 'Ratgeber',
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Loads a single post by slug.
 * @param slug Post slug from the URL.
 * @returns The post or undefined when missing.
 */
export const getPostBySlug = (slug: string): Post | undefined => {
  return getAllPosts().find((post) => post.slug === slug);
};
