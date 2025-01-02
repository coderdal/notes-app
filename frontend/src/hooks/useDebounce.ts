import { useCallback, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => Promise<void>>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      return new Promise<void>((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            await callback(...args);
            resolve();
          } catch (error) {
            console.error('Debounced callback error:', error);
            resolve();
          }
        }, delay);
      });
    },
    [callback, delay]
  );

  return debouncedCallback;
} 