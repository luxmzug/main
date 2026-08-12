import Link from 'next/link';
import type { PostFrontmatter } from '@/lib/posts';

const categoryImages: Record<string, string> = {
  Kunsttransport: '/images/service-villa.jpg',
  Relocation: '/images/service-diskret.jpg',
  Weinkeller: '/images/service-packen.jpg',
  Umzugslogistik: '/images/hero-wien.jpg',
  'Smart Home': '/images/service-diskret.jpg',
};

export const getPostImage = (category: string) => {
  return categoryImages[category] ?? '/images/hero-wien.jpg';
};

export const PostCard = (props: { post: PostFrontmatter }) => {
  const imageSrc = getPostImage(props.post.category);

  return (
    <article className="card-soft group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link className="block overflow-hidden" href={`/blog/${props.post.slug}/`}>
        <img
          alt=""
          className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          height={420}
          loading="lazy"
          src={imageSrc}
          width={720}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
          {props.post.category}
        </p>
        <h3
          className="mt-2 text-xl leading-snug text-navy transition group-hover:text-gold-dark md:text-2xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Link href={`/blog/${props.post.slug}/`}>{props.post.title}</Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted md:text-[15px]">
          {props.post.description}
        </p>
        <Link className="btn-gold mt-5 self-start" href={`/blog/${props.post.slug}/`}>
          Zum Artikel →
        </Link>
      </div>
    </article>
  );
};
