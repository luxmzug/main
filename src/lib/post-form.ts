import { z } from 'zod';
import { assertSchemaJsonInput, sanitizePostHtml } from '@/lib/sanitize';
import { saveCoverImage } from '@/lib/uploads';

const postSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.',
    ),
  description: z.string().trim().min(40).max(320),
  content: z.string().trim().min(20),
  categoryId: z.coerce.number().int().positive(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss JJJJ-MM-TT sein.'),
  schemaJson: z.string().max(50_000).optional().default(''),
});

/**
 * Reads and validates multipart post fields from an admin request.
 */
export const parsePostForm = async (form: FormData, options: { coverRequired: boolean }) => {
  const parsed = postSchema.parse({
    title: String(form.get('title') ?? ''),
    slug: String(form.get('slug') ?? ''),
    description: String(form.get('description') ?? ''),
    content: String(form.get('content') ?? ''),
    categoryId: String(form.get('categoryId') ?? ''),
    publishedAt: String(form.get('publishedAt') ?? ''),
    schemaJson: String(form.get('schemaJson') ?? ''),
  });

  const cover = form.get('cover');
  const file = cover instanceof File && cover.size > 0 ? cover : null;
  if (options.coverRequired && !file) {
    throw new Error('Ein Titelbild ist für neue Beiträge Pflicht.');
  }

  const coverImage = file ? await saveCoverImage(file) : null;
  const schemaJson = assertSchemaJsonInput(parsed.schemaJson);

  return {
    title: parsed.title,
    slug: parsed.slug,
    description: parsed.description,
    content: sanitizePostHtml(parsed.content),
    categoryId: parsed.categoryId,
    publishedAt: parsed.publishedAt,
    schemaJson,
    coverImage,
  };
};
