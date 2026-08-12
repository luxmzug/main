import type { Metadata } from 'next';
import { PostCard } from '@/components/PostCard';
import { PageHero } from '@/components/PageHero';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Ratgeber & Blog',
  description:
    'Alle Ratgeber von Luxusumzug: Umzugsplanung, Möbeltransport, Kosten, Checklisten und mehr für Wien und Österreich.',
  alternates: { canonical: '/blog/' },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
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
