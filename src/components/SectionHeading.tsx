export const SectionHeading = (props: {
  title: string;
  subtitle?: string;
  tone?: 'light' | 'dark';
}) => {
  const titleClass = props.tone === 'dark' ? 'text-white' : 'text-navy';
  const subtitleClass = props.tone === 'dark' ? 'text-white/75' : 'text-muted';

  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="section-ornament" aria-hidden="true">
        <span className="section-ornament-diamond" />
      </div>
      <h2
        className={`text-3xl leading-tight md:text-4xl lg:text-5xl ${titleClass}`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {props.title}
      </h2>
      {props.subtitle ? (
        <p className={`mt-4 text-base md:text-lg ${subtitleClass}`}>{props.subtitle}</p>
      ) : null}
    </div>
  );
};
