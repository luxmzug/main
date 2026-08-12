import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Möbeltransport',
  description:
    'Sicherer Möbeltransport in Wien: Demontage, Schutzverpackung und fachgerechter Aufbau für hochwertige Einrichtung.',
  alternates: { canonical: '/moebeltransport/' },
};

export default function MoebeltransportPage() {
  const related = getAllPosts().filter((post) =>
    ['Kunsttransport', 'Smart Home', 'Weinkeller'].includes(post.category),
  );

  return (
    <ContentPage
      breadcrumb="Möbeltransport"
      bullets={[
        'Empfindliche Oberflächen und Kanten schützen',
        'Schwere Möbel fachgerecht demontieren',
        'Ladungssicherung im Fahrzeug beachten',
        'Am Zielort sauber und positionsgenau aufbauen',
      ]}
      ctaHref="/blog/kunst-antiquitaeten-transport-wien-1-bezirk/"
      ctaLabel="Kunsttransport-Ratgeber"
      description="Hochwertige Möbel verdienen besonderen Schutz – vom Abbau bis zum Aufbau."
      intro={[
        'Möbeltransport bedeutet mehr als Tragen: richtige Demontage, spannungsarme Verpackung und sichere Positionierung im Fahrzeug verhindern Schäden.',
        'Für Kunst, Antiquitäten, Designermöbel oder empfindliche Technik empfehlen wir objektspezifische Schutzkonzepte.',
      ]}
      relatedPosts={related.length > 0 ? related : getAllPosts().slice(0, 3)}
      title="Möbeltransport mit Extra-Schutz"
    />
  );
}
