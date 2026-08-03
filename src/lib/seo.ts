import { siteConfig } from '@/lib/site';

/**
 * Builds LocalBusiness + WebSite JSON-LD for the homepage.
 */
export const buildHomeJsonLd = () => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.locale,
        publisher: { '@id': `${siteConfig.url}/#organization` },
      },
      {
        '@type': 'MovingCompany',
        '@id': `${siteConfig.url}/#organization`,
        name: siteConfig.legalName,
        url: siteConfig.url,
        email: siteConfig.email,
        image: `${siteConfig.url}/images/og-cover.jpg`,
        logo: `${siteConfig.url}/icons/icon-512.png`,
        description: siteConfig.description,
        areaServed: {
          '@type': 'City',
          name: 'Wien',
          addressCountry: 'AT',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Wien',
          addressRegion: 'Wien',
          addressCountry: 'AT',
        },
        priceRange: '$$$',
        knowsAbout: [...siteConfig.keywords],
      },
    ],
  };
};

/**
 * Builds BlogPosting JSON-LD for an article page.
 */
export const buildArticleJsonLd = (props: {
  title: string;
  description: string;
  date: string;
  slug: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: props.title,
    description: props.description,
    datePublished: props.date,
    dateModified: props.date,
    inLanguage: siteConfig.locale,
    mainEntityOfPage: `${siteConfig.url}/blog/${props.slug}/`,
    author: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/icons/icon-512.png`,
      },
    },
    image: `${siteConfig.url}/images/og-cover.jpg`,
  };
};
