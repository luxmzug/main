import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-cream px-6 py-24 text-center">
      <h1 className="text-4xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
        Seite nicht gefunden
      </h1>
      <p className="mt-3 text-muted">Die angeforderte Seite existiert nicht.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link className="btn-gold" href="/">
          Zur Startseite
        </Link>
        <Link className="btn-gold-outline !text-navy hover:!text-navy" href="/blog/">
          Zum Ratgeber
        </Link>
      </div>
    </div>
  );
}
