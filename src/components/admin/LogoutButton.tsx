'use client';

import { useRouter } from 'next/navigation';

export const LogoutButton = () => {
  const router = useRouter();

  return (
    <button
      className="text-sm text-white/80 transition hover:text-gold"
      onClick={() => {
        void fetch('/api/admin/logout/', { method: 'POST' }).finally(() => {
          router.replace('/admin/login/');
          router.refresh();
        });
      }}
      type="button"
    >
      Abmelden
    </button>
  );
};
