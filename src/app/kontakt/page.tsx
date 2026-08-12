import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Kontaktieren Sie Luxusumzug für eine diskrete Anfrage zu Planung, Transport und Ratgeber-Themen.',
  alternates: { canonical: '/kontakt/' },
};

export default function KontaktPage() {
  return (
    <>
      <PageHero
        breadcrumb="Kontakt"
        description="Schildern Sie kurz Ihr Anliegen – wir melden uns verbindlich und diskret."
        title="Jetzt anfragen"
      />
      <section className="bg-cream px-4 py-14 md:px-6 md:py-20 lg:px-8">
        <div className="card-soft mx-auto max-w-2xl p-8 md:p-10">
          <h2 className="text-2xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
            Direkter Draht
          </h2>
          <p className="mt-3 text-muted">
            Schreiben Sie uns eine E-Mail mit Wunschtermin, Wohnsituation und besonderen
            Anforderungen (Kunst, Wein, Smart Home, Familie, etc.).
          </p>
          <a className="btn-gold mt-8" href={`mailto:${siteConfig.email}?subject=Anfrage%20Luxusumzug`}>
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
