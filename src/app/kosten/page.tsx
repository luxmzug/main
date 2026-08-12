import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Umzugskosten',
  description:
    'Umzugskosten verstehen: welche Faktoren den Preis beeinflussen und wie Sie transparent planen.',
  alternates: { canonical: '/kosten/' },
};

export default function KostenPage() {
  return (
    <ContentPage
      breadcrumb="Kosten"
      bullets={[
        'Wohnfläche, Etage und Zugangssituation',
        'Umfang des Inventars und Sonderstücke',
        'Packservice, Demontage und Aufbau',
        'Termin, Distanz und behördliche Genehmigungen',
      ]}
      ctaHref="/kontakt/"
      ctaLabel="Unverbindlich anfragen"
      description="Damit Sie die Kosten im Blick behalten – ohne Überraschungen am Umzugstag."
      intro={[
        'Umzugskosten entstehen nicht zufällig: Sie spiegeln Aufwand, Schutzbedarf und Organisation wider. Wer früh inventarisiert und Anforderungen klar benennt, erhält realistische Angebote.',
        'Statt unrealistischer Pauschalen empfehlen wir eine transparente Einschätzung auf Basis von Besichtigung oder detaillierter Inventarliste.',
      ]}
      relatedPosts={getAllPosts().slice(0, 3)}
      title="Umzugskosten verstehen"
    />
  );
}
