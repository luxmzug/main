import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Umzugsplanung',
  description:
    'Strukturierte Umzugsplanung für Wien: Zeitplan, Vorbereitung und Checklisten für einen stressfreien Ablauf.',
  alternates: { canonical: '/umzugsplanung/' },
};

export default function UmzugsplanungPage() {
  const related = getAllPosts().filter((post) =>
    ['Umzugslogistik', 'Relocation'].includes(post.category),
  );

  return (
    <ContentPage
      breadcrumb="Umzugsplanung"
      bullets={[
        'Realistischen Zeitplan mit Puffern erstellen',
        'Inventar und Sondergüter früh erfassen',
        'Zufahrt, Aufzug und Haltemöglichkeiten klären',
        'Übergabe der alten und neuen Immobilie vorbereiten',
      ]}
      ctaHref="/checklisten/"
      ctaLabel="Zur Checkliste"
      description="Mit klarer Vorbereitung sparen Sie Zeit, Nerven und unnötige Kosten."
      intro={[
        'Ein guter Umzug beginnt lange vor dem Transport. In der Umzugsplanung entscheiden Sie über Ablauf, Teamgröße, Schutzmaßnahmen und realistische Termine.',
        'Besonders in Wien – mit engen Gassen, Parkregeln und unterschiedlichen Wohnsituationen – zahlt sich strukturierte Vorbereitung doppelt aus.',
      ]}
      relatedPosts={related.length > 0 ? related : getAllPosts().slice(0, 3)}
      title="Umzugsplanung mit Struktur"
    />
  );
}
