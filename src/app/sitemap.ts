import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { navItems, siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = navItems.map((item) => ({
    url: `${siteConfig.url}${item.href === '/' ? '/' : item.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: item.href === '/' ? 1 : 0.7,
  }));

  const posts = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...posts];
}
