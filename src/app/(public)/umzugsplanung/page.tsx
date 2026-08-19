import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Umzugsplanung Wien – stressfrei vorbereiten',
  description:
    'Strukturierte Umzugsplanung für Wien: Zeitplan, Inventar, Zufahrt und Übergabe für einen ruhigen, sicheren Ablauf.',
  keywords: ['Umzugsplanung Wien', 'Umzug vorbereiten', 'Umzug Zeitplan', 'Luxusumzug'],
  alternates: { canonical: '/umzugsplanung/' },
  openGraph: {
    title: 'Umzugsplanung Wien',
    description: 'Mit klarer Vorbereitung sparen Sie Zeit, Nerven und unnötige Kosten.',
    url: 'https://luxusumzug.at/umzugsplanung/',
  },
};

export default function UmzugsplanungPage() {
  const related = getAllPosts().filter((post) =>
    ['Umzugslogistik', 'Relocation'].includes(post.category),
  );

  return (
    <ContentPage
      breadcrumb="Umzugsplanung"
      path="/umzugsplanung/"
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
