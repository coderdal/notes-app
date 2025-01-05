import { useCallback, useRef } from 'react';

export function useDebounce<TArgs extends readonly unknown[]>(
  callback: (...args: TArgs) => Promise<void>,
  delay: number
): (...args: TArgs) => Promise<void> {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedCallback = useCallback(
    (...args: TArgs) => {
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