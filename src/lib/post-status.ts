export const POST_STATUSES = ['published', 'scheduled', 'draft'] as const;

export type PostStatus = (typeof POST_STATUSES)[number];

export const isPostStatus = (value: string): value is PostStatus => {
  return POST_STATUSES.includes(value as PostStatus);
};

export const postStatusLabel: Record<PostStatus, string> = {
  published: 'Veröffentlicht',
  scheduled: 'Geplant',
  draft: 'Entwurf',
};

export const postStatusBadgeClass: Record<PostStatus, string> = {
  published: 'bg-emerald-100 text-emerald-800',
  scheduled: 'bg-amber-100 text-amber-900',
  draft: 'bg-slate-100 text-slate-700',
};
