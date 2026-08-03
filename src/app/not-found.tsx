import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <h1 className="text-4xl text-paper" style={{ fontFamily: 'var(--font-display)' }}>
        Seite nicht gefunden
      </h1>
      <p className="mt-3 text-paper-muted">Die angeforderte Seite existiert nicht.</p>
      <Link className="mt-8 text-brass-bright hover:text-brass" href="/">
        Zur Startseite
      </Link>
    </div>
  );
}
