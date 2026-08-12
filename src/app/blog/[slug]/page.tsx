import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PostCard } from '@/components/PostCard';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { buildArticleJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = () => {
  return getAllPosts().map((post) => ({ slug: post.slug }));
};

export const generateMetadata = async (props: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const url = `${siteConfig.url}/blog/${post.slug}/`;

  return {
    title: post.title,
    description: post.description,
    keywords: [post.category, 'Luxusumzug Wien', 'VIP Umzug', siteConfig.city],
    alternates: {
      canonical: `/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      locale: siteConfig.locale,
      publishedTime: post.date,
      modifiedTime: post.date,
      siteName: siteConfig.name,
      images: [
        {
          url: '/images/og-cover.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/images/og-cover.jpg'],
    },
  };
};

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const dateLabel = new Intl.DateTimeFormat('de-AT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(post.date));

  const related = getAllPosts()
    .filter((entry) => entry.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = buildArticleJsonLd({
    title: post.title,
    description: post.description,
    date: post.date,
    slug: post.slug,
  });

  return (
    <>
      <article className="bg-cream">
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
        <div className="bg-navy px-4 py-12 text-white md:px-6 md:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Link className="text-sm text-gold transition hover:text-gold-light" href="/blog/">
              ← Alle Ratgeber
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs tracking-[0.16em] uppercase">
              <span className="text-gold">{post.category}</span>
              <span className="text-white/40">·</span>
              <time className="text-white/70" dateTime={post.date}>
                {dateLabel}
              </time>
            </div>
            <h1
              className="mt-4 text-3xl leading-tight text-gold md:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {post.title}
            </h1>
            <p className="mt-5 text-base text-white/85 md:text-lg">{post.description}</p>
          </div>
        </div>
        <div className="prose-blog px-4 py-12 md:px-6 md:py-16">
          <MDXRemote source={post.content} />
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-navy/10 bg-cream-dark/40 px-4 py-14 md:px-6 md:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2
              className="text-center text-3xl text-navy md:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Weitere Ratgeber
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((entry) => (
                <PostCard key={entry.slug} post={entry} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
