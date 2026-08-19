export const COVER_MAX_BYTES = 2 * 1024 * 1024;
export const COVER_MAX_MB = 2;
export const COVER_RECOMMENDED_KB = 300;

/**
 * Returns an error message when the cover file is not a WebP image under the size limit.
 */
export const coverImageError = (file: File) => {
  const name = file.name.toLowerCase();
  const isWebp = file.type === 'image/webp' || name.endsWith('.webp');
  if (!isWebp) {
    return 'Titelbild muss im WebP-Format sein.';
  }

  if (file.size > COVER_MAX_BYTES) {
    return `Titelbild darf höchstens ${COVER_MAX_MB} MB groß sein.`;
  }

  return null;
};
