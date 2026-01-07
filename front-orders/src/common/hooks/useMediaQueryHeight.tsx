import { useCallback, useEffect, useState } from 'react';

const useMediaQueryHeight = (height: number): boolean => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) setTargetReached(true);
    else setTargetReached(false);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-height: ${height}px)`);
    media.addEventListener('change', updateTarget);

    if (media.matches) setTargetReached(true);

    return () => media.removeEventListener('change', updateTarget);
  }, [height, updateTarget]);

  return targetReached;
};

export default useMediaQueryHeight;
