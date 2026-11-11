import React, { useState, useEffect, useCallback } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/bodyScrollLock';
import { SearchContext } from './SearchContextBase';

export const SearchProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openSearch = useCallback((initialQuery = '') => {
    if (typeof initialQuery === 'string') {
      setSearchQuery(initialQuery);
    }
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  // Global keyboard shortcuts: "/" or "Ctrl+K" / "Cmd+K" to open, "Escape" to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If pressing "/" or (Ctrl/Cmd + K) outside of inputs
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      
      if (!isInput) {
        if (e.key === '/' || ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K'))) {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }

      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Lock body scroll when search modal is open
  useEffect(() => {
    if (isSearchOpen) {
      lockBodyScroll('search-modal');
    } else {
      unlockBodyScroll('search-modal');
    }
    return () => {
      unlockBodyScroll('search-modal');
    };
  }, [isSearchOpen]);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        searchQuery,
        setSearchQuery,
        openSearch,
        closeSearch,
        toggleSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
