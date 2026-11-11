import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/useSearch';
import { searchCatalog, POPULAR_SEARCH_TAGS, CATEGORIES } from '../data/products';
import AddToCartButton from './AddToCartButton';
import './SearchModal.css';

const SearchModal = () => {
  const { isSearchOpen, searchQuery, setSearchQuery, closeSearch } = useSearch();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input automatically when search opens (cleanup timer on close/unmount)
  useEffect(() => {
    if (!isSearchOpen) return undefined;
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(focusTimer);
  }, [isSearchOpen]);

  if (!isSearchOpen) {
    return null;
  }

  const { matchingCategories, matchingProducts } = searchCatalog(searchQuery);
  const hasQuery = searchQuery.trim().length > 0;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleSelectTag = (tag) => {
    setSearchQuery(tag);
    inputRef.current?.focus();
  };

  const handleCategoryClick = (slug) => {
    closeSearch();
    navigate(`/category/${slug}`);
  };

  return (
    <div
      className="search-modal-root"
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalog"
      onClick={handleBackdropClick}
    >
      <div className="search-modal-panel">
        {/* Search Header Bar */}
        <div className="search-bar-header">
          <div className="search-input-wrapper">
            <svg
              className="search-bar-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>

            <input
              ref={inputRef}
              type="text"
              className="search-bar-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search botanical keepsakes, bouquets, stems, peonies..."
              aria-label="Search products"
              autoComplete="off"
              spellCheck="false"
            />

            {hasQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClear}
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            className="search-close-btn"
            onClick={closeSearch}
            aria-label="Close search dialog"
          >
            <span className="search-close-key">ESC</span>
            <span className="search-close-cross">✕</span>
          </button>
        </div>

        {/* Search Modal Content Area */}
        <div className="search-modal-body">
          {!hasQuery ? (
            /* Idle / Discovery View */
            <div className="search-discovery">
              {/* Popular Searches */}
              <div className="search-section">
                <span className="search-section-label">Popular Searches</span>
                <div className="search-tags-row">
                  {POPULAR_SEARCH_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="search-tag-chip"
                      onClick={() => handleSelectTag(tag)}
                    >
                      <span className="search-tag-icon">✤</span>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Categories */}
              <div className="search-section">
                <span className="search-section-label">Explore Collections</span>
                <div className="search-categories-grid">
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      className="search-category-card"
                      onClick={() => handleCategoryClick(cat.slug)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCategoryClick(cat.slug);
                        }
                      }}
                    >
                      <div className="search-cat-img-box">
                        <img src={cat.image} alt={cat.name} className="search-cat-img" />
                      </div>
                      <div className="search-cat-info">
                        <span className="search-cat-badge">{cat.badge}</span>
                        <h4 className="search-cat-title">{cat.name}</h4>
                        <p className="search-cat-desc">{cat.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Live Filtered Results View */
            <div className="search-results">
              {/* Category Matches */}
              {matchingCategories.length > 0 && (
                <div className="search-section search-cat-matches">
                  <span className="search-section-label">Matching Collections</span>
                  <div className="search-cat-chips-row">
                    {matchingCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className="search-cat-match-pill"
                        onClick={() => handleCategoryClick(cat.slug)}
                      >
                        <span className="cat-pill-dot">❀</span>
                        <span className="cat-pill-name">{cat.name}</span>
                        <span className="cat-pill-arrow">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Matches */}
              <div className="search-section">
                <div className="search-results-meta">
                  <span className="search-section-label">
                    {matchingProducts.length} {matchingProducts.length === 1 ? 'Creation' : 'Creations'} Found
                  </span>
                  <span className="search-query-echo">
                    for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                  </span>
                </div>

                {matchingProducts.length === 0 ? (
                  /* Empty State */
                  <div className="search-empty-state">
                    <div className="search-empty-symbol">❀</div>
                    <h3 className="search-empty-title">No botanicals found</h3>
                    <p className="search-empty-text">
                      We couldn&apos;t find any items matching &ldquo;{searchQuery}&rdquo;. Try another term or explore our popular floral selections below.
                    </p>
                    <div className="search-tags-row search-empty-tags">
                      {POPULAR_SEARCH_TAGS.slice(0, 6).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="search-tag-chip"
                          onClick={() => handleSelectTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Products List */
                  <div className="search-products-list">
                    {matchingProducts.map((product) => (
                      <div key={product.id} className="search-product-card">
                        <div
                          className="search-product-image-box"
                          onClick={() => handleCategoryClick(product.category)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleCategoryClick(product.category);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`View ${product.categoryName} collection`}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="search-product-img"
                          />
                        </div>

                        <div className="search-product-details">
                          <div className="search-product-header">
                            <span className="search-product-cat-tag">
                              {product.categoryName} {product.tag ? `• ${product.tag}` : ''}
                            </span>
                            <span className="search-product-rating">{product.rating}</span>
                          </div>

                          <h4
                            className="search-product-name"
                            onClick={() => handleCategoryClick(product.category)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleCategoryClick(product.category);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            {product.name}
                          </h4>

                          <p className="search-product-desc">{product.description}</p>

                          <div className="search-product-action-row">
                            <span className="search-product-price">{product.price}</span>
                            <div className="search-product-btn-wrap">
                              <AddToCartButton
                                product={product}
                                defaultText="Add to Cart"
                                addedText="Added"
                                duration={2000}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Keyboard Shortcuts Guide */}
        <div className="search-modal-footer">
          <div className="search-footer-hint search-desktop-hint">
            <span className="footer-kbd">ESC</span> to close
          </div>
          <div className="search-footer-hint search-desktop-hint">
            <span className="footer-kbd">/</span> quick search
          </div>
          <div className="search-mobile-hint">
            Tap any creation or collection to explore
          </div>
          <div className="search-footer-brand">
            Twirl &amp; Flora • Artisan Botanical Boutique
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
