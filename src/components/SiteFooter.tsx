import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export const SiteFooter = () => {
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-0 h-24 w-full bg-cream"
        style={{
          clipPath: 'ellipse(70% 100% at 50% 0%)',
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-[1.1fr_auto_1.2fr] md:items-center md:px-6 md:py-20 lg:px-8">
        <div className="flex items-start gap-4">
          <span className="mt-1 flex size-12 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/40">
            <svg aria-hidden="true" className="size-6 text-gold" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </span>
          <div>
            <p className="text-xl text-gold" style={{ fontFamily: 'var(--font-display)' }}>
              Ihr Umzug. Unsere Leidenschaft.
            </p>
            <p className="mt-2 text-sm text-white/70">
              © {new Date().getFullYear()} {siteConfig.legalName}
            </p>
          </div>
        </div>

        <div aria-hidden="true" className="hidden h-16 w-px bg-gold/50 md:block" />

        <div className="md:pl-2">
          <p className="max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
            <strong className="text-gold">{siteConfig.name.toUpperCase()}</strong> – der Ratgeber für
            hochwertige, sichere und stressfreie Übersiedlungen.
          </p>
          <Link className="btn-gold mt-6" href="/blog/">
            Jetzt Blog entdecken →
          </Link>
        </div>
      </div>
    </footer>
  );
};
