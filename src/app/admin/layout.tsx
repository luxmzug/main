import type React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout(props: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-navy-deep">{props.children}</div>;
}
