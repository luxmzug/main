import type React from 'react';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export default function PublicLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content">{props.children}</main>
      <SiteFooter />
    </>
  );
}
