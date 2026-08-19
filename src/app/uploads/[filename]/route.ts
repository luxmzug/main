import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { uploadsDir } from '@/lib/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteProps = {
  params: Promise<{ filename: string }>;
};

/**
 * Serves cover images from the data/uploads directory.
 */
export const GET = async (_request: Request, props: RouteProps) => {
  const { filename } = await props.params;
  if (!/^[a-f0-9]{32}\.webp$/i.test(filename)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const filePath = path.join(uploadsDir, filename);
  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const body = fs.readFileSync(filePath);
  return new NextResponse(Uint8Array.from(body), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
