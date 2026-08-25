'use client';

import Link from 'next/link';
import { useState } from 'react';
import { navItems, siteConfig } from '@/lib/site';

/**
 * Public site header. Shows an Admin shortcut only for an active session.
 */
export const SiteHeader = (props: { isAdmin?: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <Link className="flex shrink-0 items-center" href="/" onClick={() => setOpen(false)}>
          <img
            alt={siteConfig.name}
            className="h-10 w-auto md:h-12"
            height={48}
            src="/images/lxmzg.webp"
            width={220}
          />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <Link
              className="rounded-md px-2.5 py-2 text-[13px] font-medium text-white/90 transition hover:bg-white/10 hover:text-gold-light"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          {props.isAdmin ? (
            <Link className="btn-gold-outline ml-2 !px-3 !py-2 !text-xs" href="/admin/">
              Admin
            </Link>
          ) : null}
        </nav>

        <button
          aria-controls="mobile-nav"
          aria-expanded={open}
          className="inline-flex items-center justify-center rounded-md border border-white/20 p-2 text-white xl:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span className="sr-only">Menü</span>
          <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeWidth="2" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-navy-deep xl:hidden" id="mobile-nav">
          <nav aria-label="Mobile Navigation" className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {navItems.map((item) => (
              <Link
                className="border-b border-white/10 py-3 text-sm font-medium text-white/90"
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {props.isAdmin ? (
              <Link
                className="py-3 text-sm font-semibold text-gold"
                href="/admin/"
                onClick={() => setOpen(false)}
              >
                Admin
              </Link>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
};
