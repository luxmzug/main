import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/LoginForm';
import { getSession } from '@/lib/auth/session';
import { siteConfig } from '@/lib/site';

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/admin/');
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16" id="main-content">
      <div className="w-full max-w-md rounded-2xl border border-gold/30 bg-navy p-8 shadow-xl">
        <p className="text-xs tracking-[0.18em] text-gold uppercase">Redaktion</p>
        <h1
          className="mt-2 text-3xl text-gold"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {siteConfig.name} Admin
        </h1>
        <p className="mt-2 mb-8 text-sm text-white/70">Session-basierte Anmeldung für die Beitragsverwaltung.</p>
        <LoginForm />
      </div>
    </main>
  );
}
