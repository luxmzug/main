import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { getPostImagePath } from '@/lib/seo';
import { navItems, siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = navItems.map((item) => {
    const path = item.href === '/' ? '/' : item.href;
    return {
      url: `${siteConfig.url}${path === '/' ? '/' : path}`,
      lastModified: new Date(),
      changeFrequency: (item.href === '/' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: item.href === '/' ? 1 : item.href === '/blog/' ? 0.9 : 0.7,
    };
  });

  const legalRoutes = [
    {
      url: `${siteConfig.url}/impressum/`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  const posts = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
    images: [`${siteConfig.url}${getPostImagePath(post)}`],
  }));

  return [...staticRoutes, ...legalRoutes, ...posts];
}
