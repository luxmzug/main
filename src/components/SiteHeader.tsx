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
    <header className="sticky top-0 z-50 text-white shadow-md" style={{ backgroundColor: '#132840' }}>
      <div className="mx-auto flex h-16 max-w-7xl items-stretch justify-between gap-4 px-3 md:h-20 md:px-5 lg:px-7">
        <Link className="flex shrink-0 items-stretch self-stretch pb-1.5" href="/" onClick={() => setOpen(false)}>
          <img
            alt={siteConfig.name}
            className="h-full w-auto max-w-[min(72vw,22rem)] object-contain object-left md:max-w-[26rem]"
            height={80}
            src="/images/lxmzg.webp"
            width={360}
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
          className="inline-flex items-center justify-center self-center rounded-md border border-white/20 p-2 text-white xl:hidden"
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
        <div
          className="border-t border-white/10 xl:hidden"
          id="mobile-nav"
          style={{ backgroundColor: '#132840' }}
        >
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
