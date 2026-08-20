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
        <Link className="flex min-w-0 items-center gap-3" href="/" onClick={() => setOpen(false)}>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-gold/15 ring-1 ring-gold/40">
            <svg aria-hidden="true" className="size-7 text-gold" fill="none" viewBox="0 0 32 32">
              <path
                d="M4 22h24l-2-8H12l-2 3H6l-2 5Z"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
              <path d="M8 14V9h4v3" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="10" cy="23.5" fill="currentColor" r="1.6" />
              <circle cx="23" cy="23.5" fill="currentColor" r="1.6" />
              <path d="M16 6l1.2 2.4L20 9l-2.2 1.6.6 2.6L16 11.8 13.6 13.2l.6-2.6L12 9l2.8-.6L16 6Z" fill="currentColor" />
            </svg>
          </span>
          <span className="min-w-0">
            <span
              className="block truncate text-lg font-semibold tracking-[0.08em] text-gold uppercase md:text-xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {siteConfig.name}
            </span>
            <span className="hidden text-[10px] tracking-[0.18em] text-white/70 uppercase sm:block">
              {siteConfig.tagline}
            </span>
          </span>
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
