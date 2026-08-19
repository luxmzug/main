import { NextResponse } from 'next/server';
import {
  AdminHttpError,
  adminErrorResponse,
  applySessionRotation,
  requireAdminApi,
} from '@/lib/auth/guard';
import { createPost, slugTaken } from '@/lib/posts';
import { parsePostForm } from '@/lib/post-form';

export const runtime = 'nodejs';

export const POST = async (request: Request) => {
  try {
    const { session } = await requireAdminApi(request);
    const form = await request.formData();
    const input = await parsePostForm(form, { coverRequired: true });

    if (slugTaken(input.slug)) {
      throw new AdminHttpError('Dieser Slug ist bereits vergeben.', 409);
    }

    const created = createPost(input);
    if (!created) {
      throw new AdminHttpError('Beitrag konnte nicht gespeichert werden.', 500);
    }
    return applySessionRotation(
      NextResponse.json({ id: created.id, slug: created.slug }, { status: 201 }),
      session,
    );
  } catch (error) {
    return adminErrorResponse(error);
  }
};
