import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { PostCard } from '@/components/PostCard';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import {
  buildArticleJsonLd,
  getPostImagePath,
  getReadingTimeMinutes,
} from '@/lib/seo';
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
  const image = getPostImagePath(post.category);

  return {
    title: post.title,
    description: post.description,
    keywords: [post.category, post.title, 'Luxusumzug Wien', 'Umzug Wien', siteConfig.city],
    authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
    category: post.category,
    alternates: {
      canonical: `/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      locale: siteConfig.ogLocale,
      publishedTime: post.date,
      modifiedTime: post.date,
      section: post.category,
      tags: [post.category, 'Luxusumzug', 'Wien'],
      siteName: siteConfig.name,
      images: [
        {
          url: image,
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
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
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

  const readingTime = getReadingTimeMinutes(post.content);

  const related = getAllPosts()
    .filter((entry) => entry.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={buildArticleJsonLd(post)} />
      <article className="bg-cream" itemScope itemType="https://schema.org/BlogPosting">
        <meta content={post.title} itemProp="headline" />
        <meta content={post.description} itemProp="description" />
        <meta content={post.date} itemProp="datePublished" />
        <div className="bg-navy px-4 py-12 text-white md:px-6 md:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Breadcrumbs
              items={[
                { name: 'Start', href: '/' },
                { name: 'Ratgeber', href: '/blog/' },
                { name: post.title },
              ]}
              tone="dark"
            />
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs tracking-[0.16em] uppercase">
              <span className="text-gold">{post.category}</span>
              <span className="text-white/40">·</span>
              <time className="text-white/70" dateTime={post.date} itemProp="datePublished">
                {dateLabel}
              </time>
              <span className="text-white/40">·</span>
              <span className="text-white/70">{readingTime} Min. Lesezeit</span>
            </div>
            <h1
              className="mt-4 text-3xl leading-tight text-gold md:text-5xl"
              itemProp="headline"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {post.title}
            </h1>
            <p className="mt-5 text-base text-white/85 md:text-lg" itemProp="description">
              {post.description}
            </p>
          </div>
        </div>
        <div className="prose-blog px-4 py-12 md:px-6 md:py-16" itemProp="articleBody">
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
            <div className="mt-10 text-center">
              <Link className="btn-gold" href="/blog/">
                Alle Ratgeber ansehen →
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
