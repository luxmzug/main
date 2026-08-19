'use client';

import type { InternalLinkPost } from '@/lib/posts';

export const InternalPostPicker = (props: {
  posts: InternalLinkPost[];
  query: string;
  onQuery: (value: string) => void;
  onSelect: (post: InternalLinkPost) => void;
}) => {
  const needle = props.query.trim().toLowerCase();
  const matches = props.posts.filter((post) => {
    if (!needle) {
      return true;
    }
    return (
      post.title.toLowerCase().includes(needle) ||
      post.categoryName.toLowerCase().includes(needle) ||
      post.slug.toLowerCase().includes(needle)
    );
  });

  return (
    <div className="mt-3">
      <input
        className="admin-input"
        onChange={(event) => props.onQuery(event.target.value)}
        placeholder="Beitrag suchen…"
        type="search"
        value={props.query}
      />
      <div className="mt-2 max-h-56 overflow-y-auto rounded-md border border-navy/10 bg-white">
        {matches.length === 0 ? (
          <p className="px-3 py-4 text-sm text-muted">Keine Beiträge gefunden.</p>
        ) : (
          matches.map((post) => (
            <button
              className="flex w-full flex-col items-start gap-0.5 border-b border-navy/5 px-3 py-2 text-left last:border-0 hover:bg-gold/15"
              key={post.id}
              onClick={() => props.onSelect(post)}
              type="button"
            >
              <span className="text-sm font-medium text-navy">{post.title}</span>
              <span className="text-xs text-muted">
                {post.categoryName} · /blog/{post.slug}/
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
