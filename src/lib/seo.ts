import type { Post, PostFrontmatter } from '@/lib/posts';
import { siteConfig } from '@/lib/site';

const categoryImages: Record<string, string> = {
  Kunsttransport: '/images/service-villa.jpg',
  Relocation: '/images/service-diskret.jpg',
  Weinkeller: '/images/service-packen.jpg',
  Umzugslogistik: '/images/hero-wien.jpg',
  'Smart Home': '/images/service-diskret.jpg',
};

/**
 * Resolves a representative image path for a post category.
 */
export const getPostImagePath = (category: string) => {
  return categoryImages[category] ?? '/images/hero-header.webp';
};

/**
 * Builds an absolute URL from a site-relative path.
 */
export const absoluteUrl = (path = '/') => {
  if (path.startsWith('http')) {
    return path;
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
};

/**
 * Estimates reading time in minutes from markdown content.
 */
export const getReadingTimeMinutes = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

/**
 * Counts words in markdown content.
 */
export const getWordCount = (content: string) => {
  return content.trim().split(/\s+/).filter(Boolean).length;
};

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

const organizationId = () => `${siteConfig.url}/#organization`;
const websiteId = () => `${siteConfig.url}/#website`;

/**
 * Editorial publisher brand (not a moving company).
 */
export const buildOrganizationJsonLd = () => {
  return {
    '@type': 'Organization',
    '@id': organizationId(),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.email,
    description:
      'Redaktionelles Informationsangebot zu hochwertigen Umzügen in Wien und Österreich. Kein Gewerbe, keine Umzugsdienstleistung.',
    areaServed: [
      { '@type': 'City', name: 'Wien', addressCountry: 'AT' },
      { '@type': 'Country', name: 'Österreich' },
    ],
    image: absoluteUrl(siteConfig.ogImage),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icons/icon-512.png'),
      width: 512,
      height: 512,
    },
    knowsAbout: [...siteConfig.keywords],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      email: siteConfig.email,
      availableLanguage: ['de-AT', 'German'],
    },
  };
};

/**
 * Homepage graph: WebSite + Organization + ItemList of posts.
 */
export const buildHomeJsonLd = (posts: PostFrontmatter[]) => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId(),
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.locale,
        publisher: { '@id': organizationId() },
      },
      buildOrganizationJsonLd(),
      {
        '@type': 'ItemList',
        '@id': `${siteConfig.url}/#latest-posts`,
        name: 'Neueste Ratgeber-Beiträge',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: posts.length,
        itemListElement: posts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(`/blog/${post.slug}/`),
          name: post.title,
        })),
      },
    ],
  } satisfies JsonLd;
};

/**
 * BreadcrumbList entity (without @context, for @graph usage).
 */
export const buildBreadcrumbList = (
  items: { name: string; path: string }[],
) => {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
};

/**
 * BreadcrumbList JSON-LD.
 */
export const buildBreadcrumbJsonLd = (
  items: { name: string; path: string }[],
) => {
  return {
    '@context': 'https://schema.org',
    ...buildBreadcrumbList(items),
  };
};

/**
 * WebPage JSON-LD for static content pages.
 */
export const buildWebPageJsonLd = (props: {
  title: string;
  description: string;
  path: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationJsonLd(),
      {
        '@type': 'WebPage',
        '@id': absoluteUrl(props.path),
        url: absoluteUrl(props.path),
        name: props.title,
        description: props.description,
        inLanguage: siteConfig.locale,
        isPartOf: { '@id': websiteId() },
        about: { '@id': organizationId() },
        primaryImageOfPage: absoluteUrl(siteConfig.ogImage),
      },
    ],
  };
};

/**
 * CollectionPage JSON-LD for the blog index.
 */
export const buildBlogIndexJsonLd = (posts: PostFrontmatter[]) => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': absoluteUrl('/blog/'),
        url: absoluteUrl('/blog/'),
        name: 'Ratgeber & Blog | Luxusumzug',
        description: siteConfig.description,
        inLanguage: siteConfig.locale,
        isPartOf: { '@id': websiteId() },
        about: { '@id': organizationId() },
      },
      {
        '@type': 'ItemList',
        itemListElement: posts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(`/blog/${post.slug}/`),
          name: post.title,
        })),
      },
      buildBreadcrumbList([
        { name: 'Start', path: '/' },
        { name: 'Ratgeber', path: '/blog/' },
      ]),
    ],
  };
};

/**
 * BlogPosting JSON-LD with rich article signals.
 */
export const buildArticleJsonLd = (post: Post) => {
  const url = absoluteUrl(`/blog/${post.slug}/`);
  const image = absoluteUrl(getPostImagePath(post.category));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        name: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: siteConfig.locale,
        articleSection: post.category,
        keywords: [post.category, ...siteConfig.keywords].join(', '),
        wordCount: getWordCount(post.content),
        timeRequired: `PT${getReadingTimeMinutes(post.content)}M`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        url,
        image: [image, absoluteUrl(siteConfig.ogImage)],
        author: { '@id': organizationId() },
        publisher: { '@id': organizationId() },
        isPartOf: { '@id': websiteId() },
      },
      buildOrganizationJsonLd(),
      buildBreadcrumbList([
        { name: 'Start', path: '/' },
        { name: 'Ratgeber', path: '/blog/' },
        { name: post.title, path: `/blog/${post.slug}/` },
      ]),
    ],
  };
};

/**
 * FAQPage JSON-LD.
 */
export const buildFaqJsonLd = (
  faqs: { question: string; answer: string }[],
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Builds Next.js Metadata-friendly Open Graph image entries.
 */
export const buildOgImages = (path: string, alt: string) => {
  return [
    {
      url: path,
      width: 1200,
      height: 630,
      alt,
    },
  ];
};
