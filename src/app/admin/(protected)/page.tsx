import Link from 'next/link';
import { DeletePostButton } from '@/components/admin/DeletePostButton';
import { listAdminPosts } from '@/lib/posts';

export default function AdminDashboardPage() {
  const posts = listAdminPosts();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
            Beiträge
          </h1>
          <p className="mt-1 text-sm text-muted">Anlegen, bearbeiten und SEO-Felder pflegen.</p>
        </div>
        <Link className="btn-gold" href="/admin/posts/new/">
          Neuer Beitrag
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-navy/10 bg-cream text-xs tracking-[0.12em] text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Titel</th>
              <th className="px-4 py-3">Kategorie</th>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Bild</th>
              <th className="px-4 py-3">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={5}>
                  Noch keine Beiträge.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr className="border-b border-navy/5 last:border-0" key={post.id}>
                  <td className="px-4 py-3 font-medium text-navy">{post.title}</td>
                  <td className="px-4 py-3 text-muted">{post.categoryName}</td>
                  <td className="px-4 py-3 text-muted">{post.publishedAt.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-muted">{post.coverImage ? 'Ja' : 'Kategorie'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link className="text-gold-dark hover:underline" href={`/admin/posts/${post.id}/edit/`}>
                        Bearbeiten
                      </Link>
                      <Link className="text-muted hover:underline" href={`/blog/${post.slug}/`} target="_blank">
                        Ansehen
                      </Link>
                      <DeletePostButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
