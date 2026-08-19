'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        setPending(true);
        setError('');

        void fetch('/api/admin/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: String(data.get('email') ?? ''),
            password: String(data.get('password') ?? ''),
          }),
        })
          .then(async (response) => {
            const payload = (await response.json()) as { error?: string };
            if (!response.ok) {
              setError(payload.error ?? 'Anmeldung fehlgeschlagen.');
              return;
            }
            router.replace('/admin/');
            router.refresh();
          })
          .catch(() => {
            setError('Anmeldung fehlgeschlagen.');
          })
          .finally(() => {
            setPending(false);
          });
      }}
    >
      <label className="block">
        <span className="mb-1 block text-xs font-semibold tracking-[0.12em] text-gold uppercase">
          E-Mail
        </span>
        <input
          autoComplete="username"
          className="admin-input"
          name="email"
          required
          type="email"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold tracking-[0.12em] text-gold uppercase">
          Passwort
        </span>
        <input
          autoComplete="current-password"
          className="admin-input"
          name="password"
          required
          type="password"
        />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button className="btn-gold w-full" disabled={pending} type="submit">
        {pending ? 'Bitte warten…' : 'Anmelden'}
      </button>
    </form>
  );
};
