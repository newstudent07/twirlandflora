const activeLocks = new Set();
let savedOverflow = null;

/**
 * Ref-counted body scroll lock manager so overlapping overlays
 * (Mobile Nav Drawer, Search Modal, Cart Drawer, Policy Dialog)
 * never prematurely unlock background scrolling on mobile browsers.
 */
export function lockBodyScroll(lockKey) {
  if (typeof document === 'undefined' || !lockKey) return;

  if (activeLocks.size === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  activeLocks.add(lockKey);
}

export function unlockBodyScroll(lockKey) {
  if (typeof document === 'undefined' || !lockKey) return;

  activeLocks.delete(lockKey);

  if (activeLocks.size === 0) {
    document.body.style.overflow = savedOverflow || '';
    savedOverflow = null;
  }
}

