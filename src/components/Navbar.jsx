import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useSearch } from '../context/useSearch';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, openCart } = useCart();
  const { openSearch } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const categories = [
    { name: 'All Categories', path: '/' },
    { name: 'Keychains', path: '/category/keychains' },
    { name: 'Bouquets', path: '/category/bouquets' },
    { name: 'Pot Flowers', path: '/category/pot-flowers' },
    { name: 'Single Flowers', path: '/category/single-flowers' },
  ];

  return (
    <>
      <div className="announcement-bar">
        <p className="announcement-text">Complimentary next-day delivery on all orders over ₹150.</p>
      </div>

      <header className="navbar">
        <div className="container nav-container">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`nav-hamburger ${mobileMenuOpen ? 'is-active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>

          {/* Desktop Links */}
          <nav className="nav-links desktop-only" aria-label="Main Navigation">
            <div className="dropdown">
              <Link to="/" className="dropdown-toggle">Shop by Category</Link>
              <div className="dropdown-menu">
                <Link to="/category/keychains">Keychains</Link>
                <Link to="/category/bouquets">Bouquets</Link>
                <Link to="/category/pot-flowers">Pot Flowers</Link>
                <Link to="/category/single-flowers">Single Flowers</Link>
              </div>
            </div>
            <Link to="/our-story">Our Story</Link>
          </nav>

          {/* Brand Logo & Editorial Tagline */}
          <div className="nav-logo">
            <Link to="/" aria-label="Twirl & Flora Home">
              <h2>Twirl & Flora</h2>
            </Link>
            <span className="nav-tagline">Everlasting blooms, crafted with love.</span>
          </div>

          {/* Nav Actions (Search, Account, Cart) */}
          <div className="nav-actions">
            <button
              type="button"
              className="icon-btn nav-search-btn"
              onClick={openSearch}
              aria-label="Search catalog"
              title="Search catalog (Press / or Ctrl+K)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="action-label desktop-only">Search</span>
            </button>

            <button type="button" className="icon-btn nav-account-btn desktop-only" aria-label="Account">
              Account
            </button>

            <button
              type="button"
              className="icon-btn nav-cart-btn"
              onClick={openCart}
              aria-label={`Open Cart with ${cartCount} items`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="nav-cart-count">({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`mobile-nav-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      />

      <aside
        className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
        aria-label="Mobile Navigation"
      >
        <div className="mobile-nav-header">
          <div className="mobile-brand">
            <span className="mobile-brand-title">Twirl & Flora</span>
            <span className="mobile-brand-sub">Botanical Atelier</span>
          </div>
          <button
            type="button"
            className="mobile-nav-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="mobile-nav-content">
          <div className="mobile-nav-section">
            <span className="mobile-section-heading">Collections</span>
            <nav className="mobile-nav-links">
              {categories.map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{cat.name}</span>
                  <span className="mobile-link-arrow">→</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mobile-nav-section">
            <span className="mobile-section-heading">The Atelier</span>
            <nav className="mobile-nav-links">
              <Link
                to="/our-story"
                className="mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Our Story & Philosophy</span>
                <span className="mobile-link-arrow">→</span>
              </Link>
            </nav>
          </div>

          <div className="mobile-nav-footer">
            <button
              type="button"
              className="mobile-action-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                openSearch();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Search Florals</span>
            </button>
            <p className="mobile-perk-text">
              🌿 Free next-day boutique delivery on orders over ₹150
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
