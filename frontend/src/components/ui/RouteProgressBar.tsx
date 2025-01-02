'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RouteProgressBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let progressInterval: NodeJS.Timeout;
    let completeTimeout: NodeJS.Timeout;

    const startLoading = () => {
      setLoading(true);
      setProgress(0);

      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          const diff = Math.random() * 10;
          return Math.min(prev + diff, 90);
        });
      }, 300);
    };

    const completeLoading = () => {
      clearInterval(progressInterval);
      setProgress(100);
      completeTimeout = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    };

    startLoading();
    // Complete the loading after a short delay
    setTimeout(completeLoading, 500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [pathname, searchParams, mounted]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 w-full bg-indigo-100">
        <div
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            transition: progress === 100 ? 'all 200ms ease-out' : 'all 400ms ease-out'
          }}
        />
      </div>
    </div>
  );
} 