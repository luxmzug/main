import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Über Luxusumzug – Ratgeber mit Anspruch',
  description:
    'Über Luxusumzug: Orientierung für hochwertige, sichere und stressfreie Übersiedlungen in Wien und Österreich.',
  keywords: ['Über Luxusumzug', 'Umzug Ratgeber Wien', 'VIP Umzug Österreich'],
  alternates: { canonical: '/ueber-uns/' },
};

export default function UeberUnsPage() {
  return (
    <ContentPage
      breadcrumb="Über uns"
      path="/ueber-uns/"
      bullets={[
        'Fokus auf Planung, Schutz und klare Abläufe',
        'Inhalte für anspruchsvolle Privathaushalte',
        'Praxisnahe Ratgeber statt leerer Versprechen',
      ]}
      ctaHref="/kontakt/"
      description="Ihr Umzug. Unsere Leidenschaft."
      intro={[
        'Luxusumzug ist ein redaktioneller Ratgeber rund um stilvolles, sicheres und strukturiertes Übersiedeln. Wir bündeln praxisnahe Informationen zu Planung, Möbeltransport, Kosten und Checklisten – ohne gewerbliches Leistungsangebot.',
        'Ziel ist Orientierung und ein gutes Gefühl beim Ankommen – mit weniger Stress und mehr Überblick.',
      ]}
      relatedPosts={getAllPosts().slice(0, 3)}
      title="Über Luxusumzug"
    />
  );
}
