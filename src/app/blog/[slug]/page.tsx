import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
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

  const jsonLd = buildArticleJsonLd({
    title: post.title,
    description: post.description,
    date: post.date,
    slug: post.slug,
  });

  return (
    <article className="bg-ink pt-28 pb-24">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <Link className="text-sm text-brass-bright transition hover:text-brass" href="/#beitraege">
          ← Alle Beiträge
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-xs tracking-[0.16em] uppercase">
          <span className="text-brass">{post.category}</span>
          <span className="text-paper-muted/50">·</span>
          <time className="text-paper-muted" dateTime={post.date}>
            {dateLabel}
          </time>
        </div>
        <h1
          className="mt-4 text-4xl leading-tight text-paper md:text-6xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {post.title}
        </h1>
        <p className="mt-5 text-lg text-paper-muted">{post.description}</p>
      </div>
      <div className="prose-blog mt-14 px-6 md:px-8">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
