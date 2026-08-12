import type { Metadata } from 'next';
import Link from 'next/link';
import { AcrosticSection } from '@/components/AcrosticSection';
import { HomeHero } from '@/components/HomeHero';
import { JsonLd } from '@/components/JsonLd';
import { PostCard } from '@/components/PostCard';
import { SectionHeading } from '@/components/SectionHeading';
import { getAllPosts } from '@/lib/posts';
import { buildFaqJsonLd, buildHomeJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    type: 'website',
    locale: siteConfig.ogLocale,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.title }],
  },
};

const homeFaqs = [
  {
    question: 'Was macht einen Luxusumzug in Wien besonders?',
    answer:
      'Ein hochwertiger Umzug verbindet klare Planung, Schutz für wertvolles Inventar und ruhige Abläufe – inklusive Zufahrt, Zeitfenster und Übergabe.',
  },
  {
    question: 'Welche Themen decken die Ratgeber ab?',
    answer:
      'Die Beiträge behandeln unter anderem Umzugsplanung, Möbel- und Kunsttransport, Kostenfaktoren, Checklisten, Relocation sowie Smart-Home- und Weinkeller-Umzüge.',
  },
  {
    question: 'Wie starte ich am besten mit der Vorbereitung?',
    answer:
      'Beginnen Sie mit einem realistischen Zeitplan, einer Inventarliste und unseren Checklisten. Anschließend klären Sie Sondertransporte und die Übergabe.',
  },
] as const;

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd data={buildHomeJsonLd(posts)} />
      <JsonLd data={buildFaqJsonLd([...homeFaqs])} />

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

      <section className="border-t border-navy/10 bg-cream px-4 py-14 md:px-6 md:py-16 lg:px-8" id="faq">
        <div className="mx-auto max-w-3xl">
          <h2
            className="text-center text-3xl text-navy md:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Häufige Fragen
          </h2>
          <div className="mt-10 space-y-4">
            {homeFaqs.map((faq) => (
              <details
                className="card-soft group open:pb-4"
                key={faq.question}
              >
                <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-navy marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-gold transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="px-5 pb-1 text-sm leading-relaxed text-muted md:text-base">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
