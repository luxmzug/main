import Link from 'next/link';
import { navItems, siteConfig } from '@/lib/site';

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
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_1fr_1.1fr] md:items-start md:px-6 md:py-20 lg:px-8">
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
              © {new Date().getFullYear()} {siteConfig.name}
            </p>
            <Link className="mt-2 inline-block text-sm text-white/70 underline underline-offset-4 hover:text-gold" href="/impressum/">
              Impressum
            </Link>
            <a className="mt-3 inline-block text-sm text-gold hover:text-gold-light" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </div>
        </div>

        <nav aria-label="Footer Navigation">
          <p className="mb-3 text-xs tracking-[0.16em] text-gold uppercase">Navigation</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/85">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="transition hover:text-gold" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
            <strong className="text-gold">{siteConfig.name.toUpperCase()}</strong> – der Ratgeber für
            hochwertige, sichere und stressfreie Übersiedlungen in Wien und Österreich.
          </p>
          <Link className="btn-gold mt-6" href="/blog/">
            Jetzt Blog entdecken →
          </Link>
        </div>
      </div>
    </footer>
  );
};
