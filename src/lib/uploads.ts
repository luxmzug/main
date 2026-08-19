import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

const uploadsDir = path.join(/* turbopackIgnore: true */ process.cwd(), 'public/uploads');
const maxBytes = 2 * 1024 * 1024;

const signatures: { mime: string; ext: string; test: (bytes: Buffer) => boolean }[] = [
  {
    mime: 'image/jpeg',
    ext: 'jpg',
    test: (bytes) => bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  {
    mime: 'image/png',
    ext: 'png',
    test: (bytes) =>
      bytes.length > 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47,
  },
  {
    mime: 'image/webp',
    ext: 'webp',
    test: (bytes) =>
      bytes.length > 12 &&
      bytes.toString('ascii', 0, 4) === 'RIFF' &&
      bytes.toString('ascii', 8, 12) === 'WEBP',
  },
];

/**
 * Stores a cover image after magic-byte validation. Returns the public path.
 */
export const saveCoverImage = async (file: File) => {
  if (file.size > maxBytes) {
    throw new Error('Bild darf höchstens 2 MB groß sein.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const match = signatures.find((entry) => entry.test(buffer));
  if (!match) {
    throw new Error('Nur JPEG, PNG oder WebP sind erlaubt.');
  }

  fs.mkdirSync(uploadsDir, { recursive: true });
  const filename = `${randomBytes(16).toString('hex')}.${match.ext}`;
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);

  return `/uploads/${filename}`;
};
