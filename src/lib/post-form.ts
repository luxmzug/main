import { z } from 'zod';
import type { PostStatus } from '@/lib/post-status';
import { isPostStatus } from '@/lib/post-status';
import { resolveAutoQueuePublish } from '@/lib/publish-queue';
import { assertSchemaJsonInput, sanitizePostHtml } from '@/lib/sanitize';
import { saveCoverImage } from '@/lib/uploads';
import { fromDateTimeLocalVienna, normalizePublishedAt } from '@/lib/vienna-time';

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
  publishMode: z.enum(['auto', 'manual']).optional().default('auto'),
  status: z.string().optional().default('scheduled'),
  publishedAt: z.string().optional().default(''),
  publishedAtTime: z.string().optional().default(''),
  schemaJson: z.string().max(50_000).optional().default(''),
  showCoverOnDetail: z.enum(['0', '1']).optional().default('0'),
  coverAlt: z.string().trim().max(180).optional().default(''),
});

const resolveManualPublish = (parsed: z.infer<typeof postSchema>) => {
  const statusRaw = parsed.status.trim();
  const status: PostStatus = isPostStatus(statusRaw) ? statusRaw : 'draft';

  if (status === 'published' && !parsed.publishedAt && !parsed.publishedAtTime) {
    return {
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
      queuePosition: null,
    };
  }

  const datePart = parsed.publishedAt.trim();
  const timePart = parsed.publishedAtTime.trim();

  if (datePart && timePart) {
    const publishedAt = fromDateTimeLocalVienna(`${datePart}T${timePart}`);
    const due = publishedAt <= new Date().toISOString();
    return {
      status: status === 'draft' ? ('draft' as const) : due ? ('published' as const) : ('scheduled' as const),
      publishedAt,
      queuePosition: null,
    };
  }

  if (datePart) {
    const publishedAt = normalizePublishedAt(datePart);
    const due = publishedAt <= new Date().toISOString();
    return {
      status: status === 'draft' ? ('draft' as const) : due ? ('published' as const) : ('scheduled' as const),
      publishedAt,
      queuePosition: null,
    };
  }

  if (status === 'published') {
    return {
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
      queuePosition: null,
    };
  }

  return resolveAutoQueuePublish();
};

/**
 * Reads and validates multipart post fields from an admin request.
 */
export const parsePostForm = async (
  form: FormData,
  options: { coverRequired: boolean; isNew: boolean },
) => {
  const parsed = postSchema.parse({
    title: String(form.get('title') ?? ''),
    slug: String(form.get('slug') ?? ''),
    description: String(form.get('description') ?? ''),
    content: String(form.get('content') ?? ''),
    categoryId: String(form.get('categoryId') ?? ''),
    publishMode: String(form.get('publishMode') ?? 'auto'),
    status: String(form.get('status') ?? ''),
    publishedAt: String(form.get('publishedAt') ?? ''),
    publishedAtTime: String(form.get('publishedAtTime') ?? ''),
    schemaJson: String(form.get('schemaJson') ?? ''),
    showCoverOnDetail: form.get('showCoverOnDetail') === '1' ? '1' : '0',
    coverAlt: String(form.get('coverAlt') ?? ''),
  });

  const cover = form.get('cover');
  const file = cover instanceof File && cover.size > 0 ? cover : null;
  if (options.coverRequired && !file) {
    throw new Error('Ein Titelbild ist für neue Beiträge Pflicht.');
  }

  if ((options.coverRequired || file) && parsed.coverAlt.length < 3) {
    throw new Error('Bitte einen Alt-Text für das Titelbild angeben.');
  }

  const coverImage = file ? await saveCoverImage(file) : null;
  const schemaJson = assertSchemaJsonInput(parsed.schemaJson);

  const publish =
    options.isNew && parsed.publishMode === 'auto'
      ? resolveAutoQueuePublish()
      : resolveManualPublish(parsed);

  return {
    title: parsed.title,
    slug: parsed.slug,
    description: parsed.description,
    content: sanitizePostHtml(parsed.content),
    categoryId: parsed.categoryId,
    status: publish.status,
    publishedAt: publish.publishedAt,
    queuePosition: publish.queuePosition,
    schemaJson,
    coverImage,
    coverAlt: parsed.coverAlt.length > 0 ? parsed.coverAlt : null,
    showCoverOnDetail: parsed.showCoverOnDetail === '1',
  };
};
