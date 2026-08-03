import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export const SiteHeader = () => {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-8">
        <Link
          className="flex items-center gap-3 text-2xl tracking-wide text-paper transition hover:text-brass-bright md:text-3xl"
          href="/"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <img
            alt=""
            className="size-9 rounded-sm border border-brass/30 md:size-10"
            height={40}
            src="/favicon.svg"
            width={40}
          />
          <span>{siteConfig.name}</span>
        </Link>
        <nav aria-label="Hauptnavigation" className="flex items-center gap-6 md:gap-8">
          <Link
            className="text-sm font-medium tracking-[0.14em] text-paper-muted uppercase transition hover:text-paper"
            href="/#leistungen"
          >
            Leistungen
          </Link>
          <Link
            className="text-sm font-medium tracking-[0.14em] text-paper-muted uppercase transition hover:text-paper"
            href="/#beitraege"
          >
            Ratgeber
          </Link>
        </nav>
      </div>
    </header>
  );
};
