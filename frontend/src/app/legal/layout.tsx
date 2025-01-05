'use client';

import LandingHeader from '@/components/layout/LandingHeader';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader />
      <main className="pt-24 pb-10">
        {children}
      </main>
    </div>
  );
} 