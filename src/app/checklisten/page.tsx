import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Umzugschecklisten',
  description:
    'Praktische Umzugschecklisten: 8 Wochen vorher bis zur Übergabe – strukturiert und stressfrei.',
  alternates: { canonical: '/checklisten/' },
};

export default function ChecklistenPage() {
  return (
    <ContentPage
      breadcrumb="Checklisten"
      bullets={[
        '8–6 Wochen vorher: Termin, Team und Sondertransporte klären',
        '4 Wochen vorher: ausmisten, Kartons, Nachsendeauftrag',
        '2 Wochen vorher: Demontagen planen, Empfindliches markieren',
        'Umzugswoche: Übergabeprotokolle, Zählerstände, Notfallkoffer',
      ]}
      ctaHref="/blog/"
      ctaLabel="Mehr Ratgeber lesen"
      description="Wer organisiert, spart Zeit, Nerven und vermeidet Chaos."
      intro={[
        'Eine gute Checkliste macht den Unterschied zwischen hektischem Umzugstag und kontrolliertem Ablauf. Nutzen Sie die Zeitfenster vor dem Termin bewusst.',
        'Ergänzen Sie die Liste um Ihre persönlichen Punkte – Schule, Behörde, Haustiere oder besonders wertvolle Objekte.',
      ]}
      relatedPosts={getAllPosts().slice(0, 3)}
      title="Checklisten für Ihren Umzug"
    />
  );
}
