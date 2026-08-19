import sanitizeHtml from 'sanitize-html';
import { buildLinkRel } from '@/lib/link-rel';

const allowedTags = [
  'p',
  'br',
  'h2',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'strong',
  'em',
  'b',
  'i',
  'a',
  'blockquote',
  'hr',
];

/**
 * Sanitizes rich-text HTML before storage and public rendering.
 */
export const sanitizePostHtml = (html: string) => {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName, attribs) => {
        const nofollow = /\bnofollow\b/i.test(attribs.rel ?? '');
        const newTab = attribs.target === '_blank';
        const rel = buildLinkRel({ nofollow, newTab });

        return {
          tagName,
          attribs: {
            href: attribs.href ?? '',
            ...(rel ? { rel } : {}),
            ...(newTab ? { target: '_blank' } : {}),
          },
        };
      },
    },
  });
};

/**
 * Parses optional custom JSON-LD. Rejects non-object payloads.
 */
export const parseSchemaJson = (value: string | null | undefined): unknown | null => {
  if (!value || !value.trim()) {
    return null;
  }

  if (value.length > 50_000) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed === null || typeof parsed !== 'object') {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

/**
 * Validates that a string is JSON object/array markup, or empty.
 * @throws When the payload is not valid JSON-LD.
 */
export const assertSchemaJsonInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = parseSchemaJson(trimmed);
  if (parsed === null) {
    throw new Error('Schema Markup muss gültiges JSON-Objekt oder Array sein.');
  }

  return trimmed;
};
