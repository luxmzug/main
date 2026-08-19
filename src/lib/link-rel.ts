/**
 * Builds a safe rel value. Dofollow omits nofollow; new tabs always get noopener.
 */
export const buildLinkRel = (options: { nofollow: boolean; newTab: boolean }) => {
  const tokens: string[] = [];
  if (options.newTab) {
    tokens.push('noopener', 'noreferrer');
  }
  if (options.nofollow) {
    tokens.push('nofollow');
  }
  return tokens.join(' ');
};
