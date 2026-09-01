import type { Metadata } from 'next';
import Link from 'next/link';
import { AcrosticSection } from '@/components/AcrosticSection';
import { HomeHero } from '@/components/HomeHero';
import { JsonLd } from '@/components/JsonLd';
import { PostCard } from '@/components/PostCard';
import { SectionHeading } from '@/components/SectionHeading';
import { getLatestPosts } from '@/lib/posts';
import { buildFaqJsonLd, buildHomeJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

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
  {
    question: 'Bietet luxusumzug.at Umzugsdienstleistungen an?',
    answer:
      'Nein. Die Website ist ein redaktionelles Informationsangebot. Es wird kein Gewerbe ausgeübt und es werden keine Umzüge vermittelt oder durchgeführt.',
  },
] as const;

export default function HomePage() {
  const latestPosts = getLatestPosts();

  return (
    <>
      <JsonLd data={buildHomeJsonLd(latestPosts)} />
      <JsonLd data={buildFaqJsonLd([...homeFaqs])} />

      <HomeHero />
      <AcrosticSection />

      <section className="border-t border-navy/10 bg-cream px-4 py-14 md:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2
            className="text-center text-2xl text-navy md:text-3xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Entrümpelung als Vorbereitung für den Umzug
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
            Wer in Wien umzieht, profitiert oft von einem klaren Start: Bestandsaufnahme, Sortieren und
            gezieltes Ausmisten vor dem Transport. Eine professionelle{' '}
            <a
              className="font-medium text-navy underline decoration-gold/60 underline-offset-4 transition hover:text-gold-dark"
              href="https://sofortentrumpelung.at/leistungen/wohnungsentruempelung"
            >
              Wohnungsentrumpelung Wien
            </a>{' '}
            reduziert Volumen und Kosten, erleichtert die Übergabe der alten Wohnung und schafft Ruhe für
            die eigentliche Übersiedlung. Planen Sie Entrümpelung und Umzugstermin deshalb frühzeitig
            gemeinsam – so bleibt der Ablauf strukturiert und stressarm.
          </p>
        </div>
      </section>

      <section className="bg-cream-dark/50 px-4 py-16 md:px-6 md:py-24 lg:px-8" id="ratgeber">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            subtitle="Die acht aktuellsten Leitfäden – alle Beiträge im Ratgeber-Index."
            title="Unsere neuesten Ratgeber-Beiträge"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {latestPosts.map((post) => (
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
