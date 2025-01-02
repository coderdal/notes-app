'use client';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useEffect, useState } from 'react';

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-40 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
} 