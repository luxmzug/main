'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DeletePostButton } from '@/components/admin/DeletePostButton';
import type { PostStatus } from '@/lib/post-status';
import { postStatusBadgeClass, postStatusLabel } from '@/lib/post-status';
import type { PostRecord } from '@/lib/posts';
import { formatPublishAtVienna, formatPublishCountdown, toDateTimeLocalVienna } from '@/lib/vienna-time';

type AdminTab = 'all' | PostStatus;

const tabs: { id: AdminTab; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'published', label: 'Veröffentlicht' },
  { id: 'scheduled', label: 'Geplant / Warteschlange' },
  { id: 'draft', label: 'Entwurf' },
];

export const AdminPostList = (props: { posts: PostRecord[] }) => {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>('all');
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [rescheduleValue, setRescheduleValue] = useState('');
  const [migrateMessage, setMigrateMessage] = useState('');
  const [migratePending, setMigratePending] = useState(false);

  const filtered =
    tab === 'all' ? props.posts : props.posts.filter((post) => post.status === tab);

  const queuePosts = props.posts
    .filter((post) => post.status === 'scheduled')
    .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));

  return (
    <>
      <div className="mb-6 rounded-xl border border-navy/10 bg-white p-4">
        <p className="text-sm font-semibold text-navy">Bestehende Beiträge in Warteschlange</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Einmalig ausführen: Google-indexierte Beiträge bleiben veröffentlicht, alle anderen
          published-Beiträge werden auf 7 pro Tag verteilt.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            className="btn-gold-outline !px-3 !py-2 !text-xs !text-navy"
            disabled={migratePending}
            onClick={() => {
              if (
                !window.confirm(
                  'Alle nicht ausgeschlossenen veröffentlichten Beiträge in die Warteschlange legen?',
                )
              ) {
                return;
              }
              setMigratePending(true);
              setMigrateMessage('');
              void fetch('/api/admin/queue/migrate/', {
                method: 'POST',
                credentials: 'include',
              })
                .then(async (response) => {
                  const payload = (await response.json()) as {
                    error?: string;
                    scheduled?: { length: number }[];
                    excluded?: { length: number }[];
                  };
                  if (!response.ok) {
                    setMigrateMessage(payload.error ?? 'Migration fehlgeschlagen.');
                    return;
                  }
                  const scheduledCount = payload.scheduled?.length ?? 0;
                  const excludedCount = payload.excluded?.length ?? 0;
                  setMigrateMessage(
                    `${scheduledCount} Beiträge eingeplant, ${excludedCount} ausgeschlossen.`,
                  );
                  router.refresh();
                })
                .catch(() => {
                  setMigrateMessage('Migration fehlgeschlagen.');
                })
                .finally(() => {
                  setMigratePending(false);
                });
            }}
            type="button"
          >
            {migratePending ? 'Läuft…' : 'Migration starten'}
          </button>
          {migrateMessage ? <span className="text-xs text-muted">{migrateMessage}</span> : null}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((entry) => (
          <button
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              tab === entry.id ? 'bg-gold text-navy' : 'bg-navy/5 text-navy hover:bg-navy/10'
            }`}
            key={entry.id}
            onClick={() => setTab(entry.id)}
            type="button"
          >
            {entry.label}
            <span className="ml-1 opacity-70">
              (
              {entry.id === 'all'
                ? props.posts.length
                : props.posts.filter((post) => post.status === entry.id).length}
              )
            </span>
          </button>
        ))}
      </div>

      {tab === 'scheduled' || tab === 'all' ? (
        queuePosts.length > 0 ? (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <h2 className="text-lg font-semibold text-navy">Veröffentlichungs-Warteschlange</h2>
            <p className="mt-1 text-sm text-muted">
              {queuePosts.length} Beiträge warten auf automatische Veröffentlichung (7 pro Tag).
            </p>
            <ol className="mt-4 space-y-2">
              {queuePosts.map((post, index) => (
                <li
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-100 bg-white px-3 py-2 text-sm"
                  key={post.id}
                >
                  <span className="font-medium text-navy">
                    {index + 1}. {post.title}
                  </span>
                  <span className="text-muted">
                    {formatPublishAtVienna(post.publishedAt)} · {formatPublishCountdown(post.publishedAt)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : null
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-navy/10 bg-cream text-xs tracking-[0.12em] text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Titel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Veröffentlichung</th>
              <th className="px-4 py-3">Kategorie</th>
              <th className="px-4 py-3">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={5}>
                  Keine Beiträge in dieser Ansicht.
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr className="border-b border-navy/5 last:border-0" key={post.id}>
                  <td className="px-4 py-3 font-medium text-navy">
                    {post.title}
                    {post.queuePosition ? (
                      <span className="mt-1 block text-xs font-normal text-muted">
                        Queue #{post.queuePosition}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${postStatusBadgeClass[post.status]}`}
                    >
                      {postStatusLabel[post.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    <span className="block">{formatPublishAtVienna(post.publishedAt)}</span>
                    {post.status === 'scheduled' ? (
                      <span className="mt-0.5 block text-xs text-amber-800">
                        {formatPublishCountdown(post.publishedAt)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-muted">{post.categoryName}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        className="text-gold-dark hover:underline"
                        href={`/admin/posts/${post.id}/edit/`}
                      >
                        Bearbeiten
                      </Link>
                      {post.status === 'published' ? (
                        <Link
                          className="text-muted hover:underline"
                          href={`/blog/${post.slug}/`}
                          target="_blank"
                        >
                          Ansehen
                        </Link>
                      ) : null}
                      {post.status === 'scheduled' || post.status === 'draft' ? (
                        <button
                          className="text-emerald-700 hover:underline disabled:opacity-50"
                          disabled={pendingId === post.id}
                          onClick={() => {
                            setPendingId(post.id);
                            void fetch(`/api/admin/posts/${post.id}/publish/`, {
                              method: 'POST',
                              credentials: 'include',
                            })
                              .then((response) => {
                                if (!response.ok) {
                                  return;
                                }
                                router.refresh();
                              })
                              .finally(() => {
                                setPendingId(null);
                              });
                          }}
                          type="button"
                        >
                          Jetzt veröffentlichen
                        </button>
                      ) : null}
                      {post.status === 'scheduled' ? (
                        <button
                          className="text-muted hover:underline"
                          onClick={() => {
                            setRescheduleId(post.id);
                            setRescheduleValue(toDateTimeLocalVienna(post.publishedAt));
                          }}
                          type="button"
                        >
                          Termin ändern
                        </button>
                      ) : null}
                      <DeletePostButton id={post.id} title={post.title} />
                    </div>
                    {rescheduleId === post.id ? (
                      <div className="mt-3 flex flex-wrap items-end gap-2">
                        <label className="block text-xs text-muted">
                          Neuer Termin (Wien)
                          <input
                            className="admin-input mt-1"
                            onChange={(event) => setRescheduleValue(event.target.value)}
                            type="datetime-local"
                            value={rescheduleValue}
                          />
                        </label>
                        <button
                          className="btn-gold !px-3 !py-2 !text-xs"
                          disabled={pendingId === post.id}
                          onClick={() => {
                            setPendingId(post.id);
                            void fetch(`/api/admin/posts/${post.id}/schedule/`, {
                              method: 'PUT',
                              credentials: 'include',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ publishedAt: rescheduleValue, status: 'scheduled' }),
                            })
                              .then((response) => {
                                if (!response.ok) {
                                  return;
                                }
                                setRescheduleId(null);
                                router.refresh();
                              })
                              .finally(() => {
                                setPendingId(null);
                              });
                          }}
                          type="button"
                        >
                          Speichern
                        </button>
                        <button
                          className="text-xs text-muted hover:text-navy"
                          onClick={() => setRescheduleId(null)}
                          type="button"
                        >
                          Abbrechen
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
