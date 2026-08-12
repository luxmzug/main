import Link from 'next/link';
import { AcrosticSection } from '@/components/AcrosticSection';
import { HomeHero } from '@/components/HomeHero';
import { PostCard } from '@/components/PostCard';
import { SectionHeading } from '@/components/SectionHeading';
import { getAllPosts } from '@/lib/posts';
import { buildHomeJsonLd } from '@/lib/seo';

export default function HomePage() {
  const posts = getAllPosts();
  const jsonLd = buildHomeJsonLd();

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />

      <HomeHero />
      <AcrosticSection />

      <section className="bg-cream-dark/50 px-4 py-16 md:px-6 md:py-24 lg:px-8" id="ratgeber">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            subtitle="Praxisnahe Leitfäden für Planung, Schutz und einen ruhigen Ablauf Ihres Umzugs."
            title="Unsere neuesten Ratgeber-Beiträge"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link className="btn-gold" href="/blog/">
              Alle Ratgeber ansehen →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
