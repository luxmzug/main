import Link from 'next/link';

export const HomeHero = () => {
  return (
    <section className="relative isolate min-h-[68vh] overflow-hidden bg-navy md:min-h-[80vh]">
      {/* Hero image: public/images/hero-header.webp */}
      <img
        alt="Professionelles Umzugsteam bei der Arbeit"
        className="absolute inset-0 -z-20 h-full w-full max-w-none object-cover object-[78%_center] sm:object-[72%_center] md:object-[center_42%]"
        fetchPriority="high"
        height={1200}
        src="/images/hero-header.webp"
        width={2000}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/92 via-navy/75 to-navy/40 md:from-navy/88 md:via-navy/55 md:to-navy/15"
      />

      <div className="mx-auto grid h-full min-h-[68vh] max-w-7xl gap-10 px-4 py-16 md:min-h-[80vh] md:grid-cols-[1.15fr_0.85fr] md:items-center md:px-6 md:py-24 lg:max-w-[90rem] lg:px-10 lg:py-28">
        <div className="animate-fade-up">
          <h1
            className="max-w-3xl text-3xl leading-tight text-gold sm:text-4xl md:text-5xl lg:text-[3.25rem]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Luxusumzug – Umziehen mit Stil, Sicherheit und Struktur
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
            Hochwertige Umzüge brauchen mehr als Muskelkraft: klare Planung, Schutz für Ihr Inventar
            und einen ruhigen Ablauf – von der ersten Checkliste bis zur Übergabe.
          </p>
          <div className="mt-8">
            <Link className="btn-gold" href="/blog/">
              Zu unseren Ratgebern
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <aside className="animate-fade-up relative justify-self-center md:justify-self-end [animation-delay:150ms]">
          <div className="relative max-w-sm rounded-[1.5rem] bg-gold px-6 py-7 text-navy shadow-xl md:px-8 md:py-9">
            <div
              aria-hidden="true"
              className="absolute -top-1 -right-1 size-10 rounded-bl-[1.25rem] bg-navy/10"
            />
            <div className="mb-3 flex justify-center text-navy">
              <svg aria-hidden="true" className="size-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l1.6 4.2L18 8l-3.4 2.5L15.6 15 12 12.8 8.4 15l1-4.5L6 8l4.4-1.8L12 2z" />
              </svg>
            </div>
            <p className="text-center text-sm leading-relaxed font-medium md:text-[15px]">
              Für alle, die nicht einfach nur umziehen möchten – sondern sicher, geplant und mit
              gutem Gefühl ankommen wollen.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};
