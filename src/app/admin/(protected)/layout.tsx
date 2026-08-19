import type React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/admin/LogoutButton';
import { getSession } from '@/lib/auth/session';

export default async function AdminProtectedLayout(props: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login/');
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <p className="text-xs tracking-[0.16em] text-gold uppercase">Luxusumzug</p>
            <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              Blog Admin
            </p>
          </div>
          <nav className="flex items-center gap-5">
            <Link className="text-sm text-white/80 hover:text-gold" href="/admin/">
              Beiträge
            </Link>
            <Link className="text-sm text-white/80 hover:text-gold" href="/admin/posts/new/">
              Neu
            </Link>
            <Link className="text-sm text-white/80 hover:text-gold" href="/" target="_blank">
              Website
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6" id="main-content">
        {props.children}
      </main>
    </div>
  );
}
