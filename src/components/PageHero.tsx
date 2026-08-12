import { Breadcrumbs } from '@/components/Breadcrumbs';

export const PageHero = (props: {
  title: string;
  description: string;
  breadcrumb?: string;
}) => {
  return (
    <section className="bg-navy px-4 py-14 text-white md:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs
          items={[
            { name: 'Start', href: '/' },
            ...(props.breadcrumb ? [{ name: props.breadcrumb }] : []),
          ]}
          tone="dark"
        />
        <h1
          className="mt-4 max-w-4xl text-3xl leading-tight text-gold md:text-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {props.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-white/85 md:text-lg">{props.description}</p>
      </div>
    </section>
  );
};
