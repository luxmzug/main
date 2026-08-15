import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/PageHero';
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kontakt – Luxusumzug',
  description:
    'Kontaktieren Sie Luxusumzug Wien bei Fragen zu den Ratgeber-Inhalten rund um Umzugsplanung und Möbeltransport.',
  keywords: ['Kontakt Luxusumzug', 'Umzug Anfrage Wien', 'VIP Umzug Kontakt'],
  alternates: { canonical: '/kontakt/' },
  openGraph: {
    title: 'Kontakt | Luxusumzug',
    description: 'Diskrete Anfrage zu Planung, Transport und Ratgeber-Themen.',
    url: `${siteConfig.url}/kontakt/`,
  },
};

export default function KontaktPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: 'Kontakt – Luxusumzug',
          description:
            'Kontaktieren Sie Luxusumzug Wien bei Fragen zu den Ratgeber-Inhalten.',
          path: '/kontakt/',
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Start', path: '/' },
          { name: 'Kontakt', path: '/kontakt/' },
        ])}
      />
      <PageHero
        breadcrumb="Kontakt"
        description="Fragen zu den Inhalten? Schreiben Sie uns – unverbindlich und diskret."
        title="Kontakt"
      />
      <section className="bg-cream px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="card-soft mx-auto max-w-2xl p-8 md:p-10">
          <h2 className="text-2xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
            Direkter Draht
          </h2>
          <p className="mt-3 text-muted">
            Schreiben Sie uns bei Fragen zu den Ratgeber-Themen. Dies ist ein
            Informationsangebot und keine Auftrags- oder Angebotsannahme.
          </p>
          <a
            className="btn-gold mt-8"
            href={`mailto:${siteConfig.email}?subject=Anfrage%20Luxusumzug`}
          >
            {siteConfig.email}
          </a>
          <p className="mt-8 text-sm text-muted">
            Oder stöbern Sie zuerst in unseren{' '}
            <Link className="font-semibold text-gold-dark underline underline-offset-4" href="/blog/">
              Ratgebern
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
