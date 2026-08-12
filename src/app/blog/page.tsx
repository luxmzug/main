import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/PageHero';
import { PostCard } from '@/components/PostCard';
import { getAllPosts } from '@/lib/posts';
import { buildBlogIndexJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Ratgeber & Blog für Umzug in Wien',
  description:
    'Alle Luxusumzug-Ratgeber im Überblick: Planung, Möbeltransport, Kosten, Checklisten, Relocation und mehr für Wien und Österreich.',
  keywords: [...siteConfig.keywords, 'Umzug Ratgeber', 'Umzug Blog Wien'],
  alternates: { canonical: '/blog/' },
  openGraph: {
    title: 'Ratgeber & Blog | Luxusumzug',
    description:
      'Alle Ratgeber von Luxusumzug: Planung, Transport, Kosten und Checklisten für hochwertige Umzüge.',
    url: `${siteConfig.url}/blog/`,
    type: 'website',
    locale: siteConfig.ogLocale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: 'Luxusumzug Ratgeber' }],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd data={buildBlogIndexJsonLd(posts)} />
      <PageHero
        breadcrumb="Ratgeber"
        description="Hier finden Sie alle aktuellen Beiträge – von der Planung bis zum sicheren Transport."
        title="Unsere Ratgeber-Beiträge"
      />
      <section className="bg-cream px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
