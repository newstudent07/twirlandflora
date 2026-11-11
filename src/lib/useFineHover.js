import { useEffect, useState } from 'react';

const QUERY = '(hover: hover) and (pointer: fine)';

/**
 * Returns true only when the primary pointer supports true hover (desktop mouse/trackpad),
 * preventing sticky :hover / whileHover states after tapping on touch phones.
 */
export function useFineHover() {
  const [fineHover, setFineHover] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia(QUERY);
    const update = (e) => setFineHover(e.matches);

    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return fineHover;
}

