import { PostForm } from '@/components/admin/PostForm';
import { listCategories } from '@/lib/posts';

export default function NewPostPage() {
  const categories = listCategories();

  return (
    <>
      <h1 className="mb-8 text-3xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
        Neuer Beitrag
      </h1>
      <div className="rounded-2xl border border-navy/10 bg-white p-6 md:p-8">
        <PostForm categories={categories} />
      </div>
    </>
  );
}
