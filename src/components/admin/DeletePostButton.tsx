'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const DeletePostButton = (props: { id: number; title: string }) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      className="text-sm text-red-700 hover:underline"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Beitrag „${props.title}“ wirklich löschen?`)) {
          return;
        }
        setPending(true);
        void fetch(`/api/admin/posts/${props.id}/`, { method: 'DELETE' })
          .then((response) => {
            if (response.ok) {
              router.refresh();
            }
          })
          .finally(() => {
            setPending(false);
          });
      }}
      type="button"
    >
      {pending ? 'Löschen…' : 'Löschen'}
    </button>
  );
};
