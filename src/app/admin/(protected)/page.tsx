import Link from 'next/link';
import { AdminPostList } from '@/components/admin/AdminPostList';
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
          <p className="mt-1 text-sm text-muted">
            Veröffentlichte, geplante und Entwurfs-Beiträge verwalten.
          </p>
        </div>
        <Link className="btn-gold" href="/admin/posts/new/">
          Neuer Beitrag
        </Link>
      </div>

      <AdminPostList posts={posts} />
    </>
  );
}
