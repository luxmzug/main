import { siteConfig } from '@/lib/site';

export const SiteFooter = () => {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-paper-muted md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="text-paper" style={{ fontFamily: 'var(--font-display)' }}>
            {siteConfig.legalName}
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} · Exklusive Umzugsservices in {siteConfig.city}
          </p>
        </div>
        <div className="flex flex-col gap-1 md:items-end">
          <a className="transition hover:text-brass-bright" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          <p>VIP-Umzug · Relocation · Kunsttransport</p>
        </div>
      </div>
    </footer>
  );
};
