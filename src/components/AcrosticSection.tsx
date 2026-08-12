import type { LucideIcon } from 'lucide-react';
import {
  Banknote,
  Calendar,
  ClipboardList,
  Clock,
  Diamond,
  Heart,
  Home,
  PackageCheck,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';

const iconClassName = 'size-5 shrink-0 text-[#d4af37] md:size-6';

const acrostic: {
  letter: string;
  title: string;
  text: string;
  Icon: LucideIcon;
}[] = [
  {
    letter: 'L',
    title: 'Logistik planen',
    text: 'Ein guter Umzug beginnt lange vor dem Transport.',
    Icon: Truck,
  },
  {
    letter: 'U',
    title: 'Umzug stressfrei gestalten',
    text: 'Mit klarer Vorbereitung und realistischen Zeitplänen.',
    Icon: Calendar,
  },
  {
    letter: 'X',
    title: 'Extra Schutz für Wertvolles',
    text: 'Hochwertige Möbel, Glas, Technik oder Kunst brauchen besondere Aufmerksamkeit.',
    Icon: Diamond,
  },
  {
    letter: 'U',
    title: 'Übersicht behalten',
    text: 'Wer organisiert, spart Zeit, Nerven und vermeidet Chaos.',
    Icon: ClipboardList,
  },
  {
    letter: 'S',
    title: 'Sicher transportieren',
    text: 'Vom richtigen Verpackungsmaterial bis zur Ladungssicherung.',
    Icon: ShieldCheck,
  },
  {
    letter: 'U',
    title: 'Übergabe vorbereiten',
    text: 'Ob alte Wohnung, neues Haus oder Bürofläche – eine saubere Übergabe ist Gold wert.',
    Icon: Home,
  },
  {
    letter: 'M',
    title: 'Möbel schützen',
    text: 'Möbel richtig demontieren, sichern und am neuen Ort sauber aufbauen.',
    Icon: PackageCheck,
  },
  {
    letter: 'Z',
    title: 'Zeit sparen',
    text: 'Gute Planung verhindert doppelte Wege und unnötige Wartezeiten.',
    Icon: Clock,
  },
  {
    letter: 'U',
    title: 'Umzugskosten verstehen',
    text: 'Damit Sie die Kosten im Blick behalten.',
    Icon: Banknote,
  },
  {
    letter: 'G',
    title: 'Gut ankommen',
    text: 'Am Ende zählt, dass alles angekommen ist und der neue Lebensabschnitt entspannt beginnt.',
    Icon: Heart,
  },
];

const trustIcons: { label: string; Icon: LucideIcon }[] = [
  { label: 'Premium Umzugsservice', Icon: Diamond },
  { label: 'Sicherer Transport', Icon: ShieldCheck },
  { label: 'Zuverlässig & pünktlich', Icon: Truck },
  { label: 'Stressfrei ankommen', Icon: Heart },
];

export const AcrosticSection = () => {
  return (
    <section className="bg-cream px-4 py-16 md:px-6 md:py-24 lg:px-8" id="bedeutung">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Die Bedeutung von LUXUSUMZUG" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <ul className="space-y-3">
            {acrostic.map((item) => (
              <li
                className="card-soft flex items-center gap-3 px-3 py-3 md:gap-4 md:px-4"
                key={`${item.letter}-${item.title}`}
              >
                <item.Icon aria-hidden="true" className={iconClassName} strokeWidth={1.75} />
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-navy text-lg font-bold text-gold md:size-12 md:text-xl">
                  {item.letter}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-navy">{item.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
              <img
                alt="Sorgfältiger Möbeltransport durch ein professionelles Team"
                className="aspect-[4/5] w-full object-cover"
                height={900}
                loading="lazy"
                src="/images/service-packen.jpg"
                width={720}
              />
              <div className="absolute inset-x-4 bottom-4 rounded-xl bg-gold px-4 py-4 text-center text-navy shadow-lg md:inset-x-6">
                <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                  Sicher. Gepflegt. Stressfrei umziehen.
                </p>
                <p className="mt-1 tracking-widest text-navy/80" aria-label="5 von 5 Sternen">
                  ★ ★ ★ ★ ★
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {trustIcons.map((item) => (
                <div
                  className="rounded-xl border border-navy/8 bg-white/70 p-4 text-center"
                  key={item.label}
                >
                  <item.Icon
                    aria-hidden="true"
                    className="mx-auto size-6 text-[#d4af37]"
                    strokeWidth={1.75}
                  />
                  <p className="mt-2 text-xs font-semibold tracking-wide text-navy uppercase md:text-[13px]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
