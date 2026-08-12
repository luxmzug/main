import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { getPostImagePath } from '@/lib/seo';
import { navItems, siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = navItems.map((item) => {
    const path = item.href === '/' ? '/' : item.href;
    return {
      url: `${siteConfig.url}${path === '/' ? '/' : path}`,
      lastModified: new Date(),
      changeFrequency: (item.href === '/' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority:
        item.href === '/'
          ? 1
          : item.href === '/blog/'
            ? 0.9
            : item.href === '/kontakt/'
              ? 0.8
              : 0.7,
    };
  });

  const posts = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
    images: [`${siteConfig.url}${getPostImagePath(post.category)}`],
  }));

  return [...staticRoutes, ...posts];
}
