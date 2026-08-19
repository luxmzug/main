import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { COVER_MAX_BYTES, COVER_MAX_MB } from '@/lib/cover-image';

const uploadsDir = path.join(/* turbopackIgnore: true */ process.cwd(), 'public/uploads');

const isWebp = (bytes: Buffer) => {
  return (
    bytes.length > 12 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  );
};

/**
 * Stores a WebP cover image after magic-byte validation. Returns the public path.
 */
export const saveCoverImage = async (file: File) => {
  if (file.size > COVER_MAX_BYTES) {
    throw new Error(`Titelbild darf höchstens ${COVER_MAX_MB} MB groß sein.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!isWebp(buffer)) {
    throw new Error('Titelbild muss im WebP-Format sein.');
  }

  fs.mkdirSync(uploadsDir, { recursive: true });
  const filename = `${randomBytes(16).toString('hex')}.webp`;
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);

  return `/uploads/${filename}`;
};
