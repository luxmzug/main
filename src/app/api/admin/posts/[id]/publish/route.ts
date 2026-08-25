import { NextResponse } from 'next/server';
import {
  AdminHttpError,
  adminErrorResponse,
  applySessionRotation,
  requireAdminApi,
} from '@/lib/auth/guard';
import { getPostById } from '@/lib/posts';
import { publishPostNow } from '@/lib/publish-queue';

export const runtime = 'nodejs';

type RouteProps = {
  params: Promise<{ id: string }>;
};

/**
 * Publishes a scheduled or draft post immediately.
 */
export const POST = async (request: Request, props: RouteProps) => {
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

    const updated = publishPostNow(numeric);
    if (!updated) {
      throw new AdminHttpError('Veröffentlichung fehlgeschlagen.', 500);
    }

    return applySessionRotation(NextResponse.json({ ok: true, slug: updated.slug }), session);
  } catch (error) {
    return adminErrorResponse(error);
  }
};
