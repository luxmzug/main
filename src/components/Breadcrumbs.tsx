import Link from 'next/link';

export const Breadcrumbs = (props: {
  items: { name: string; href?: string }[];
  tone?: 'light' | 'dark';
}) => {
  const muted = props.tone === 'dark' ? 'text-white/55' : 'text-muted';
  const link = props.tone === 'dark' ? 'text-gold hover:text-gold-light' : 'text-gold-dark hover:text-gold';

  return (
    <nav aria-label="Brotkrumen" className="text-xs tracking-[0.14em] uppercase">
      <ol className="flex flex-wrap items-center gap-2">
        {props.items.map((item, index) => {
          const isLast = index === props.items.length - 1;

          return (
            <li className="flex items-center gap-2" key={`${item.name}-${index}`}>
              {index > 0 ? <span className={muted}>/</span> : null}
              {item.href && !isLast ? (
                <Link className={link} href={item.href}>
                  {item.name}
                </Link>
              ) : (
                <span className={props.tone === 'dark' ? 'text-gold' : 'text-navy'}>{item.name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
