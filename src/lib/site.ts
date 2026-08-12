export const siteConfig = {
  name: 'Luxusumzug',
  tagline: 'Umziehen mit Stil',
  legalName: 'Luxusumzug Wien',
  title: 'Luxusumzug – Umziehen mit Stil, Sicherheit und Struktur',
  description:
    'Luxusumzug: der Ratgeber für hochwertige, sichere und stressfreie Übersiedlungen. Planung, Möbeltransport, Checklisten und Kostenorientierung für Wien und Österreich.',
  url: 'https://luxusumzug.at',
  locale: 'de-AT',
  city: 'Wien',
  region: 'Wien',
  country: 'AT',
  email: 'kontakt@luxusumzug.at',
  keywords: [
    'Luxusumzug',
    'Umzug Wien',
    'Möbeltransport',
    'Umzugsplanung',
    'Umzugskosten',
    'Umzugscheckliste',
    'Kunsttransport Wien',
    'Relocation Wien',
  ],
} as const;

export const navItems = [
  { href: '/', label: 'Start' },
  { href: '/blog/', label: 'Ratgeber' },
  { href: '/umzugsplanung/', label: 'Umzugsplanung' },
  { href: '/moebeltransport/', label: 'Möbeltransport' },
  { href: '/kosten/', label: 'Kosten' },
  { href: '/checklisten/', label: 'Checklisten' },
  { href: '/ueber-uns/', label: 'Über uns' },
  { href: '/kontakt/', label: 'Kontakt' },
] as const;
