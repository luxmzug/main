import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminErrorResponse, applySessionRotation, requireAdminApi } from '@/lib/auth/guard';
import { createCategory } from '@/lib/posts';

export const runtime = 'nodejs';

const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
});

export const POST = async (request: Request) => {
  try {
    const { session } = requireAdminApi(request);
    const body: unknown = await request.json();
    const parsed = categorySchema.parse(body);
    const category = createCategory(parsed.name);
    return applySessionRotation(NextResponse.json(category, { status: 201 }), session);
  } catch (error) {
    return adminErrorResponse(error);
  }
};
