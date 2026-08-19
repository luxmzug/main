import { notFound } from 'next/navigation';
import { PostForm } from '@/components/admin/PostForm';
import { getPostById, listCategories } from '@/lib/posts';

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage(props: EditPostPageProps) {
  const { id } = await props.params;
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric < 1) {
    notFound();
  }

  const post = getPostById(numeric);
  if (!post) {
    notFound();
  }

  return (
    <>
      <h1 className="mb-8 text-3xl text-navy" style={{ fontFamily: 'var(--font-display)' }}>
        Beitrag bearbeiten
      </h1>
      <div className="rounded-2xl border border-navy/10 bg-white p-6 md:p-8">
        <PostForm categories={listCategories()} post={post} />
      </div>
    </>
  );
}
