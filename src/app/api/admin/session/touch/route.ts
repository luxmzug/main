import { NextResponse } from 'next/server';
import { adminErrorResponse, applySessionRotation, requireAdminApi } from '@/lib/auth/guard';

export const runtime = 'nodejs';

export const POST = async (request: Request) => {
  try {
    const { session } = requireAdminApi(request);
    return applySessionRotation(NextResponse.json({ ok: true }), session);
  } catch (error) {
    return adminErrorResponse(error);
  }
};
