import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/PageHero';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Impressum / Offenlegung gemäß § 25 MedienG',
  description:
    'Impressum von luxusumzug.at gemäß § 25 MedienG: Medieninhaber, Blattlinie und rechtliche Hinweise zum redaktionellen Informationsangebot.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/impressum/' },
};

export default function ImpressumPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: 'Impressum / Offenlegung gemäß § 25 MedienG',
          description: 'Medieninhaber, Blattlinie und rechtliche Hinweise.',
          path: '/impressum/',
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Start', path: '/' },
          { name: 'Impressum', path: '/impressum/' },
        ])}
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
        description="Offenlegung gemäß § 25 MedienG."
        title="Impressum"
      />
      <section className="bg-cream px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-10 text-sm leading-relaxed text-muted md:text-base">
          <div className="card-soft p-8 md:p-10">
            <h2 className="text-2xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              Impressum / Offenlegung gemäß § 25 MedienG
            </h2>

            <h3 className="mt-8 text-lg font-semibold text-navy">
              Medieninhaber und für den Inhalt verantwortlich
            </h3>
            <p className="mt-3 text-navy">
              Nuran Duman
              <br />
              Wien, Österreich
              <br />
              E-Mail:{' '}
              <a className="underline underline-offset-4 hover:text-gold-dark" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              Grundlegende Richtung (Blattlinie)
            </h3>
            <p className="mt-3">
              Luxusumzug.at ist ein unabhängiges, redaktionelles Informations- und Ratgeberportal zu den
              Themen Umzug, Übersiedlung, Umzugsplanung, Kosten und damit zusammenhängenden Themen. Die
              Website dient ausschließlich der allgemeinen Information und Orientierung.
            </p>
          </div>

          <div>
            <h3 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              Keine gewerblichen Umzugsleistungen
            </h3>
            <p className="mt-3">
              Über Luxusumzug.at werden keine eigenen Umzugs-, Transport- oder Entrümpelungsleistungen
              angeboten oder durchgeführt. Die Website nimmt keine Umzugsaufträge entgegen und vermittelt
              keine Verträge oder verbindlichen Angebote für Umzugsleistungen.
            </p>
          </div>

          <div>
            <h3 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              Rechtliche Hinweise
            </h3>
            <p className="mt-3">
              Die auf dieser Website bereitgestellten Inhalte dienen ausschließlich der allgemeinen
              Information und Orientierung und stellen keine individuelle Rechts-, Steuer- oder sonstige
              Fachberatung dar.
            </p>
            <p className="mt-3">
              Informationen zu Preisen, Kosten, Abläufen, gesetzlichen Bestimmungen oder behördlichen
              Vorgaben werden mit größtmöglicher Sorgfalt erstellt. Dennoch kann keine Gewähr für deren
              Vollständigkeit, Richtigkeit und Aktualität übernommen werden.
            </p>
            <p className="mt-3">
              Eine Haftung für Schäden aufgrund der Nutzung der bereitgestellten Informationen ist, soweit
              gesetzlich zulässig, ausgeschlossen.
            </p>
            <p className="mt-3">
              Für Inhalte externer Websites, auf die mittels Links verwiesen wird, sind ausschließlich
              deren Betreiber verantwortlich. Bei Bekanntwerden rechtswidriger Inhalte werden entsprechende
              Links entfernt.
            </p>
          </div>

          <div>
            <h3 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              Urheberrecht
            </h3>
            <p className="mt-3">
              Die auf Luxusumzug.at veröffentlichten Texte, Grafiken und sonstigen eigenen Inhalte sind
              urheberrechtlich geschützt. Eine Verwendung außerhalb der gesetzlich zulässigen Grenzen
              bedarf der vorherigen Zustimmung des jeweiligen Rechteinhabers.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
