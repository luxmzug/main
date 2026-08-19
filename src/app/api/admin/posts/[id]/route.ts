import { NextResponse } from 'next/server';
import {
  AdminHttpError,
  adminErrorResponse,
  applySessionRotation,
  requireAdminApi,
} from '@/lib/auth/guard';
import { parsePostForm } from '@/lib/post-form';
import { deletePost, getPostById, slugTaken, updatePost } from '@/lib/posts';

export const runtime = 'nodejs';

type RouteProps = {
  params: Promise<{ id: string }>;
};

const parseId = async (props: RouteProps) => {
  const { id } = await props.params;
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric < 1) {
    throw new AdminHttpError('Ungültiger Beitrag.', 400);
  }
  return numeric;
};

export const PUT = async (request: Request, props: RouteProps) => {
  try {
    const { session } = await requireAdminApi(request);
    const id = await parseId(props);
    const existing = getPostById(id);
    if (!existing) {
      throw new AdminHttpError('Beitrag nicht gefunden.', 404);
    }

    const form = await request.formData();
    const input = await parsePostForm(form, { coverRequired: false });
    if (slugTaken(input.slug, id)) {
      throw new AdminHttpError('Dieser Slug ist bereits vergeben.', 409);
    }

    const updated = updatePost(id, {
      ...input,
      coverImage: input.coverImage ?? existing.coverImage,
    });
    if (!updated) {
      throw new AdminHttpError('Beitrag konnte nicht gespeichert werden.', 500);
    }

    return applySessionRotation(NextResponse.json({ id: updated.id, slug: updated.slug }), session);
  } catch (error) {
    return adminErrorResponse(error);
  }
};

export const DELETE = async (request: Request, props: RouteProps) => {
  try {
    const { session } = await requireAdminApi(request);
    const id = await parseId(props);
    const existing = getPostById(id);
    if (!existing) {
      throw new AdminHttpError('Beitrag nicht gefunden.', 404);
    }

    deletePost(id);
    return applySessionRotation(NextResponse.json({ ok: true }), session);
  } catch (error) {
    return adminErrorResponse(error);
  }
};
