import type React from 'react';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { getSession } from '@/lib/auth/session';

export default async function PublicLayout(props: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <>
      <SiteHeader isAdmin={Boolean(session)} />
      <main id="main-content">{props.children}</main>
      <SiteFooter />
    </>
  );
}

