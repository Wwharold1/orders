import { useEffect } from 'react';

import { useStateCallback } from '@/common/hooks/useStateCallback';

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export function useDebounce(value: string | undefined, delay: number) {
  const [debouncedValue, setDebouncedValue] = useStateCallback(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay]);
  return debouncedValue;
}
