import Link from 'next/link';
import type { PostFrontmatter } from '@/lib/posts';

const categoryImages: Record<string, string> = {
  Kunsttransport: '/images/service-villa.jpg',
  Relocation: '/images/service-diskret.jpg',
  Weinkeller: '/images/service-packen.jpg',
  Umzugslogistik: '/images/hero-wien.jpg',
  'Smart Home': '/images/service-diskret.jpg',
};

export const PostCard = (props: { post: PostFrontmatter }) => {
  const dateLabel = new Intl.DateTimeFormat('de-AT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(props.post.date));

  const imageSrc = categoryImages[props.post.category] ?? '/images/hero-wien.jpg';

  return (
    <article className="group overflow-hidden border border-white/10 bg-ink/40 transition duration-500 hover:border-brass/40">
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
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.16em] uppercase">
          <span className="text-brass">{props.post.category}</span>
          <span className="text-paper-muted/50">·</span>
          <time className="text-paper-muted" dateTime={props.post.date}>
            {dateLabel}
          </time>
        </div>
        <h3
          className="mt-3 text-2xl leading-snug text-paper transition group-hover:text-brass-bright md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Link href={`/blog/${props.post.slug}/`}>{props.post.title}</Link>
        </h3>
        <p className="mt-3 text-paper-muted">{props.post.description}</p>
        <Link
          className="mt-5 inline-flex text-sm font-medium tracking-wide text-brass-bright transition hover:text-brass"
          href={`/blog/${props.post.slug}/`}
        >
          Weiterlesen
        </Link>
      </div>
    </article>
  );
};
