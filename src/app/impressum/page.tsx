import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/PageHero';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Impressum',
  description:
    'Impressum von luxusumzug.at: Medieninhaber, Kontakt und rechtliche Hinweise zum redaktionellen Informationsangebot.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/impressum/' },
};

export default function ImpressumPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: 'Impressum',
          description: 'Medieninhaber, Kontakt und rechtliche Hinweise.',
          path: '/impressum/',
        })}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: siteConfig.ownerName,
          email: siteConfig.email,
          url: `${siteConfig.url}/impressum/`,
          jobTitle: 'Medieninhaber',
          address: {
            '@type': 'PostalAddress',
            addressLocality: siteConfig.city,
            addressCountry: 'AT',
          },
        }}
      />
      <PageHero
        breadcrumb="Impressum"
        description="Angaben gemäß österreichischem Medien- und E-Commerce-Recht."
        title="Impressum"
      />
      <section className="bg-cream px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-10 text-muted">
          <div className="card-soft p-8 md:p-10">
            <h2 className="text-2xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              Medieninhaber
            </h2>
            <dl className="mt-6 space-y-3 text-base">
              <div>
                <dt className="text-xs tracking-[0.14em] text-gold uppercase">Medieninhaber</dt>
                <dd className="mt-1 text-navy">{siteConfig.ownerName}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.14em] text-gold uppercase">Wohnort</dt>
                <dd className="mt-1 text-navy">
                  {siteConfig.city}, Österreich
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.14em] text-gold uppercase">Kontakt</dt>
                <dd className="mt-1">
                  <a className="text-navy underline underline-offset-4 hover:text-gold-dark" href={`mailto:${siteConfig.email}`}>
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-sm leading-relaxed">
              Diese Website ist ein <strong className="text-navy">redaktionelles Informationsangebot</strong>{' '}
              rund um hochwertige Umzüge. Es wird <strong className="text-navy">keine gewerbliche Tätigkeit</strong>{' '}
              ausgeübt, es besteht kein Unternehmen im Sinne der Gewerbeordnung, und es werden keine
              Umzugsleistungen, Verträge oder verbindlichen Angebote vermittelt.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              Rechtliche Hinweise
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed md:text-base">
              <p>
                Alle Inhalte dienen ausschließlich der allgemeinen Information und Orientierung. Sie
                ersetzen keine individuelle Beratung und stellen keine Aufforderung zum Vertragsabschluss
                dar. Angaben zu Abläufen, Kosten oder Behörden sind unverbindlich und können sich ändern.
              </p>
              <p>
                Trotz sorgfältiger Erstellung wird für Vollständigkeit, Richtigkeit und Aktualität der
                Inhalte keine Gewähr übernommen. Eine Haftung für Schäden, die aus der Nutzung oder
                Nichtnutzung der bereitgestellten Informationen entstehen, ist – soweit gesetzlich zulässig –
                ausgeschlossen.
              </p>
              <p>
                Für Inhalte verlinkter externer Websites sind ausschließlich deren Betreiber verantwortlich.
                Eine permanente Kontrolle der verlinkten Seiten ist ohne konkrete Hinweise auf
                Rechtsverstöße nicht zumutbar. Bei Bekanntwerden eines Verstoßes werden Links umgehend entfernt.
              </p>
              <p>
                Urheberrecht: Texte, Gestaltung und sonstige Inhalte dieser Website sind urheberrechtlich
                geschützt. Eine Verwendung außerhalb der gesetzlich zulässigen Grenzen bedarf der Zustimmung
                des Medieninhabers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
