import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/PageHero';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description:
    'Datenschutzerklärung von luxusumzug.at: Informationen zur Verarbeitung personenbezogener Daten, Hosting, Cloudflare und Ihre Rechte gemäß DSGVO.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/datenschutz/' },
};

export default function DatenschutzPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: 'Datenschutzerklärung',
          description:
            'Informationen zur Verarbeitung personenbezogener Daten auf luxusumzug.at gemäß DSGVO.',
          path: '/datenschutz/',
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Start', path: '/' },
          { name: 'Datenschutz', path: '/datenschutz/' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: siteConfig.ownerName,
          email: siteConfig.email,
          telephone: siteConfig.phone,
          url: `${siteConfig.url}/datenschutz/`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: siteConfig.streetAddress,
            postalCode: siteConfig.postalCode,
            addressLocality: siteConfig.addressLocality,
            addressCountry: siteConfig.country,
          },
        }}
      />
      <PageHero
        breadcrumb="Datenschutz"
        description="Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO."
        title="Datenschutzerklärung"
      />
      <section className="bg-cream px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-muted md:text-base">
          <p>
            Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Diese Datenschutzerklärung
            informiert Sie darüber, welche Daten bei einem Besuch von luxusumzug.at verarbeitet
            werden, zu welchem Zweck dies geschieht und welche Rechte Ihnen dabei zustehen.
          </p>

          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              1. Verantwortlicher
            </h2>
            <p className="mt-3">Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
            <p className="mt-3 text-navy">
              Nuran Duman
              <br />
              Dr. Karl-Swoboda-Str. 25
              <br />
              2486 Pottendorf
              <br />
              Österreich
              <br />
              Telefon: {siteConfig.phone}
              <br />
              E-Mail:{' '}
              <a className="underline underline-offset-4 hover:text-gold-dark" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              2. Allgemeines zur Datenverarbeitung
            </h2>
            <p className="mt-3">
              Luxusumzug.at ist ein Informations- und Dienstleistungsportal. Personenbezogene Daten
              werden nur verarbeitet, soweit dies für den Betrieb der Website technisch notwendig ist
              oder Sie uns Daten freiwillig zur Verfügung stellen (z. B. per E-Mail-Anfrage für
              Umzugsdienstleistungen).
            </p>
          </div>

          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              3. Hosting und Server-Logfiles
            </h2>
            <p className="mt-3">
              Diese Website wird bei IONOS gehostet. Beim Aufruf der Website werden durch den
              Hosting-Anbieter automatisch sogenannte Server-Logfiles erfasst, die Ihr Browser
              automatisch übermittelt. Dazu gehören:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>IP-Adresse</li>
              <li>Datum und Uhrzeit der Anfrage</li>
              <li>aufgerufene Seite/Datei</li>
              <li>verwendeter Browser und Betriebssystem</li>
              <li>verweisende URL (Referrer)</li>
            </ul>
            <p className="mt-3">
              Diese Daten werden ausschließlich zur Gewährleistung eines störungsfreien Betriebs, zur
              Sicherheit der Website sowie zur technischen Fehleranalyse verarbeitet. Rechtsgrundlage
              ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem stabilen und sicheren
              Betrieb). Eine Zusammenführung mit anderen Datenquellen erfolgt nicht.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              4. Content Delivery Network (Cloudflare)
            </h2>
            <p className="mt-3">
              Diese Website nutzt Dienste des Anbieters Cloudflare, Inc., 101 Townsend St, San
              Francisco, CA 94107, USA, unter anderem zum Schutz vor Spam-Bots (z. B.
              E-Mail-Adressen-Verschleierung) und zur Auslieferung von Website-Inhalten. Dabei können
              technische Daten wie Ihre IP-Adresse an Cloudflare übermittelt werden. Cloudflare kann
              auch außerhalb der EU verarbeiten; für Datenübermittlungen in die USA stützt sich
              Cloudflare auf Standardvertragsklauseln gemäß Art. 46 DSGVO bzw. das EU-US Data Privacy
              Framework. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
              Sicherheit und zuverlässiger Bereitstellung der Website).
            </p>
            <p className="mt-3">
              Weitere Informationen finden Sie in der Datenschutzerklärung von Cloudflare:{' '}
              <a
                className="underline underline-offset-4 hover:text-gold-dark"
                href="https://www.cloudflare.com/privacypolicy/"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://www.cloudflare.com/privacypolicy/
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              5. Cookies
            </h2>
            <p className="mt-3">
              Diese Website setzt keine zustimmungspflichtigen Tracking- oder Analyse-Cookies ein. Eine
              Einwilligung über ein Cookie-Banner ist daher nicht erforderlich.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              6. Kontaktaufnahme per E-Mail
            </h2>
            <p className="mt-3">
              Auf der Website ist eine E-Mail-Adresse zur Kontaktaufnahme angegeben. Wenn Sie uns per
              E-Mail kontaktieren, werden die von Ihnen mitgeteilten Daten (z. B. Absenderadresse,
              Name, Telefonnummer, Nachrichteninhalt bzw. Umzugsdetails) ausschließlich zur Bearbeitung
              und Beantwortung Ihrer Anfrage verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
              DSGVO (Vertragserfüllung oder vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse an der Beantwortung von Anfragen). Die Daten werden gelöscht,
              sobald sie für die Bearbeitung nicht mehr erforderlich sind, sofern keine gesetzlichen
              Aufbewahrungspflichten entgegenstehen.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              7. Empfänger / Auftragsverarbeiter
            </h2>
            <p className="mt-3">
              Eine Übermittlung Ihrer Daten an Dritte erfolgt nur, soweit dies zur Erbringung der oben
              genannten Dienste notwendig ist (z. B. Hosting-Anbieter, Cloudflare). Mit allen
              Auftragsverarbeitern bestehen bzw. werden Verträge gemäß Art. 28 DSGVO abgeschlossen. Eine
              Übermittlung zu Werbezwecken oder ein Verkauf Ihrer Daten an Dritte findet nicht statt.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              8. Speicherdauer
            </h2>
            <p className="mt-3">
              Personenbezogene Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck
              erforderlich ist bzw. wie es gesetzliche Aufbewahrungsfristen vorsehen. Server-Logfiles
              werden in der Regel nach spätestens 14 Tagen automatisch gelöscht oder anonymisiert.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              9. Ihre Rechte
            </h2>
            <p className="mt-3">Ihnen stehen nach der DSGVO folgende Rechte zu:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li>Recht auf Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
            </ul>
            <p className="mt-3">
              Zur Ausübung dieser Rechte genügt eine formlose Mitteilung per E-Mail an{' '}
              <a className="underline underline-offset-4 hover:text-gold-dark" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              10. Beschwerderecht
            </h2>
            <p className="mt-3">
              Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren, wenn Sie
              der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO
              verstößt:
            </p>
            <p className="mt-3 text-navy">
              Österreichische Datenschutzbehörde
              <br />
              Barichgasse 40–42, 1030 Wien
              <br />
              Telefon: +43 1 52 152-0
              <br />
              E-Mail: dsb@dsb.gv.at
              <br />
              Web: www.dsb.gv.at
            </p>
          </div>

          <div>
            <h2 className="text-xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
              11. Änderungen dieser Datenschutzerklärung
            </h2>
            <p className="mt-3">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte
              Rechtslagen oder bei Änderungen der Website bzw. der eingesetzten Dienste anzupassen.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
