import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/PageHero';
import { PostCard } from '@/components/PostCard';
import type { Post } from '@/lib/posts';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo';

export const ContentPage = (props: {
  breadcrumb: string;
  path: string;
  title: string;
  description: string;
  intro: string[];
  bullets?: string[];
  relatedPosts: Post[];
  ctaHref?: string;
  ctaLabel?: string;
}) => {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          title: props.title,
          description: props.description,
          path: props.path,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Start', path: '/' },
          { name: props.breadcrumb, path: props.path },
        ])}
      />
      <PageHero
        breadcrumb={props.breadcrumb}
        description={props.description}
        title={props.title}
      />
      <section className="bg-cream px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {props.intro.map((paragraph) => (
            <p className="mb-5 text-base leading-relaxed text-muted md:text-lg" key={paragraph}>
              {paragraph}
            </p>
          ))}
          {props.bullets && props.bullets.length > 0 ? (
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted">
              {props.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {props.ctaHref && props.ctaLabel ? (
            <Link className="btn-gold mt-8" href={props.ctaHref}>
              {props.ctaLabel}
            </Link>
          ) : null}
        </div>
      </section>

      {props.relatedPosts.length > 0 ? (
        <section className="border-t border-navy/10 bg-cream-dark/40 px-4 py-14 md:px-6 md:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2
              className="text-center text-3xl text-navy"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Passende Ratgeber
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {props.relatedPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link className="btn-gold" href="/blog/">
                Alle Beiträge ansehen →
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};
