import { NextResponse } from 'next/server';
import {
  adminErrorResponse,
  applySessionRotation,
  requireAdminApi,
} from '@/lib/auth/guard';
import { runScheduleExistingPostsMigration } from '@/lib/schedule-existing-posts';

export const runtime = 'nodejs';

/**
 * Runs the one-time drip-queue migration for existing published posts.
 */
export const POST = async (request: Request) => {
  try {
    const { session } = await requireAdminApi(request);
    const result = runScheduleExistingPostsMigration();
    return applySessionRotation(NextResponse.json(result), session);
  } catch (error) {
    return adminErrorResponse(error);
  }
};
