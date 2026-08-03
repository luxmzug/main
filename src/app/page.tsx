import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import { getAllPosts } from '@/lib/posts';
import { buildHomeJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

const services = [
  {
    title: 'Kunst & Antiquitäten',
    text: 'Klimasensibler Transport für Gemälde, historische Möbel und Sammlungen – dokumentiert und diskret.',
    image: '/images/service-villa.jpg',
    href: '/blog/kunst-antiquitaeten-transport-wien-1-bezirk/',
  },
  {
    title: 'Relocation & Diplomatie',
    text: 'Full-Service für Diplomaten, Expats und Führungskräfte – mit klaren Prozessen und maximaler Vertraulichkeit.',
    image: '/images/service-diskret.jpg',
    href: '/blog/relocation-service-wien-diplomaten/',
  },
  {
    title: 'Weinkeller & High-End Technik',
    text: 'Temperatursicherer Weinservice sowie sorgfältiger Abbau und Wiederaufbau von Smart-Home- und IT-Systemen.',
    image: '/images/service-packen.jpg',
    href: '/blog/weinkeller-umzug-wien-doebling/',
  },
] as const;

const trustPoints = [
  {
    title: 'Diskretion als Standard',
    text: 'Begrenzte Teams, klare Zuständigkeiten und zurückhaltende Präsenz – besonders für VIP- und diplomatische Haushalte.',
  },
  {
    title: 'Planung vor Kraft',
    text: 'Besichtigung, Halteverbotszone, Schutzkonzept und Zeitfenster werden vor dem ersten Karton verbindlich geklärt.',
  },
  {
    title: 'Objektschutz in Wien',
    text: 'Historische Treppenhäuser, Parkett und enge Innenstadtzufahrten verlangen lokales Feingefühl – nicht nur Transportkapazität.',
  },
] as const;

export default function HomePage() {
  const posts = getAllPosts();
  const jsonLd = buildHomeJsonLd();

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />

      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <img
          alt="Repräsentative Residenz – Sinnbild für exklusive Umzüge in Wien"
          className="absolute inset-0 -z-20 size-full object-cover animate-hero-zoom"
          fetchPriority="high"
          height={1200}
          src="/images/hero-wien.jpg"
          width={2000}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/35"
        />
        <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-20 pt-28 md:px-8 md:pb-28">
          <p
            className="mb-3 animate-fade-up text-5xl text-paper md:text-7xl lg:text-8xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {siteConfig.name}
          </p>
          <h1 className="animate-fade-up max-w-3xl text-3xl leading-tight text-paper [animation-delay:120ms] md:text-5xl">
            Exklusive Umzüge in Wien
          </h1>
          <p className="animate-fade-up mt-5 max-w-xl text-base text-paper-muted [animation-delay:220ms] md:text-lg">
            Diskrete Planung und erstklassige Ausführung für Villen, Penthouses und anspruchsvolle
            Haushalte in Wien und Österreich.
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-4 [animation-delay:320ms]">
            <Link
              className="inline-flex items-center bg-brass px-6 py-3 text-sm font-semibold tracking-wide text-ink transition hover:bg-brass-bright"
              href="/#leistungen"
            >
              Leistungen entdecken
            </Link>
            <Link
              className="inline-flex items-center border border-paper/25 px-6 py-3 text-sm font-semibold tracking-wide text-paper transition hover:border-brass hover:text-brass-bright"
              href="/#beitraege"
            >
              Ratgeber lesen
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-ink-soft" id="leistungen">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
          <h2
            className="text-4xl text-paper md:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Leistungen für anspruchsvolle Haushalte
          </h2>
          <p className="mt-4 max-w-2xl text-paper-muted">
            Von Kunsttransport bis Relocation: wir orchestrieren komplexe VIP-Umzüge mit Ruhe,
            Präzision und lokalem Wien-Know-how.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <Link
                className="group block overflow-hidden border border-white/10 transition hover:border-brass/40"
                href={service.href}
                key={service.title}
              >
                <img
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  height={480}
                  loading="lazy"
                  src={service.image}
                  width={640}
                />
                <div className="p-6">
                  <h3
                    className="text-2xl text-paper group-hover:text-brass-bright"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper-muted">{service.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink" id="vertrauen">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-28">
          <div>
            <h2
              className="text-4xl text-paper md:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vertrauen durch Ablaufklarheit
            </h2>
            <p className="mt-4 text-paper-muted">
              Ein Luxusumzug in Wien gelingt nicht durch Lautstärke, sondern durch vorausschauende
              Organisation – von der Halteverbotszone bis zum letzten Aufbau.
            </p>
            <ul className="mt-10 space-y-8">
              {trustPoints.map((point) => (
                <li key={point.title}>
                  <h3 className="text-lg text-brass-bright">{point.title}</h3>
                  <p className="mt-2 text-paper-muted">{point.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <img
              alt="Sorgfältige Vorbereitung eines hochwertigen Umzugs"
              className="w-full object-cover"
              height={900}
              loading="lazy"
              src="/images/service-packen.jpg"
              width={800}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/50 to-transparent p-6">
              <p className="text-sm tracking-[0.14em] text-brass uppercase">Wien · Österreich</p>
              <p className="mt-1 text-xl text-paper" style={{ fontFamily: 'var(--font-display)' }}>
                Präzision statt Improvisation
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink-soft" id="beitraege">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
          <h2
            className="text-4xl text-paper md:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ratgeber & Einblicke
          </h2>
          <p className="mt-3 max-w-2xl text-paper-muted">
            Praxisnahe Leitfäden zu Kunsttransport, Relocation, Weinkeller, Halteverbotszonen und
            Smart-Home-Umzügen in Wien.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink">
        <div className="mx-auto max-w-6xl px-6 py-16 md:flex md:items-end md:justify-between md:px-8 md:py-20">
          <div className="max-w-2xl">
            <h2
              className="text-3xl text-paper md:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vertrauliche Erstberatung
            </h2>
            <p className="mt-3 text-paper-muted">
              Schildern Sie Objekt, Zeitraum und besondere Anforderungen – wir melden uns diskret
              und verbindlich.
            </p>
          </div>
          <a
            className="mt-8 inline-flex bg-brass px-6 py-3 text-sm font-semibold tracking-wide text-ink transition hover:bg-brass-bright md:mt-0"
            href={`mailto:${siteConfig.email}?subject=Anfrage%20Luxusumzug%20Wien`}
          >
            {siteConfig.email}
          </a>
        </div>
      </section>
    </>
  );
}
