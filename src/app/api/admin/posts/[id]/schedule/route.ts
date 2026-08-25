import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  AdminHttpError,
  adminErrorResponse,
  applySessionRotation,
  requireAdminApi,
} from '@/lib/auth/guard';
import { isPostStatus } from '@/lib/post-status';
import { getPostById } from '@/lib/posts';
import { reschedulePost } from '@/lib/publish-queue';
import { fromDateTimeLocalVienna } from '@/lib/vienna-time';

export const runtime = 'nodejs';

type RouteProps = {
  params: Promise<{ id: string }>;
};

const bodySchema = z.object({
  publishedAt: z.string().min(1),
  status: z.string().optional(),
});

/**
 * Reschedules a post to a new publish datetime.
 */
export const PUT = async (request: Request, props: RouteProps) => {
  try {
    const { session } = await requireAdminApi(request);
    const { id } = await props.params;
    const numeric = Number(id);
    if (!Number.isInteger(numeric) || numeric < 1) {
      throw new AdminHttpError('Ungültiger Beitrag.', 400);
    }

    const existing = getPostById(numeric);
    if (!existing) {
      throw new AdminHttpError('Beitrag nicht gefunden.', 404);
    }

    const payload = bodySchema.parse(await request.json());
    const publishedAt = fromDateTimeLocalVienna(payload.publishedAt);
    const statusRaw = payload.status?.trim() ?? 'scheduled';
    const status = isPostStatus(statusRaw) ? statusRaw : 'scheduled';

    const updated = reschedulePost(numeric, publishedAt, status);
    if (!updated) {
      throw new AdminHttpError('Termin konnte nicht gespeichert werden.', 500);
    }

    return applySessionRotation(NextResponse.json({ ok: true }), session);
  } catch (error) {
    return adminErrorResponse(error);
  }
};
