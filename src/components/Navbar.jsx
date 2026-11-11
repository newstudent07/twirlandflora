import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/bodyScrollLock';
import { useCart } from '../context/useCart';
import { useSearch } from '../context/useSearch';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, cartTotal, openCart } = useCart();
  const { openSearch } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberSignedIn, setMemberSignedIn] = useState(false);
  const [memberError, setMemberError] = useState('');
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Close mobile drawer immediately when navigating to a new route (render-time sync)
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      lockBodyScroll('mobile-nav');
    } else {
      unlockBodyScroll('mobile-nav');
    }
    return () => {
      unlockBodyScroll('mobile-nav');
    };
  }, [mobileMenuOpen]);

  // Lock body scroll when account modal is open
  useEffect(() => {
    if (accountModalOpen) {
      lockBodyScroll('account-modal');
    } else {
      unlockBodyScroll('account-modal');
    }
    return () => {
      unlockBodyScroll('account-modal');
    };
  }, [accountModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (accountModalOpen) {
          setAccountModalOpen(false);
        } else if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, accountModalOpen]);

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    const trimmed = memberEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMemberError('Please enter a valid email address.');
      return;
    }
    setMemberError('');
    setMemberSignedIn(true);
  };

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

            <button
              type="button"
              className="icon-btn nav-account-btn desktop-only"
              onClick={() => setAccountModalOpen(true)}
              aria-label="Account & atelier circle"
              aria-expanded={accountModalOpen}
            >
              {memberSignedIn ? 'Atelier' : 'Account'}
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
              {categories.map((cat) => {
                const isCurrent = location.pathname === cat.path;
                return (
                  <Link
                    key={cat.path}
                    to={cat.path}
                    className={`mobile-link ${isCurrent ? 'is-current' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{cat.name}</span>
                    <span className="mobile-link-arrow">→</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mobile-nav-section">
            <span className="mobile-section-heading">The Atelier</span>
            <nav className="mobile-nav-links">
              <Link
                to="/our-story"
                className={`mobile-link ${location.pathname === '/our-story' ? 'is-current' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Our Story & Philosophy</span>
                <span className="mobile-link-arrow">→</span>
              </Link>
            </nav>
          </div>

          <div className="mobile-nav-footer">
            <div className="mobile-drawer-buttons">
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
              <button
                type="button"
                className="mobile-secondary-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAccountModalOpen(true);
                }}
              >
                <span>{memberSignedIn ? 'Atelier Member' : 'Boutique Account'}</span>
              </button>
            </div>
            <p className="mobile-perk-text">
              🌿 Free next-day boutique delivery on orders over ₹150
            </p>
          </div>
        </div>
      </aside>

      {/* Boutique Account & Atelier Concierge Modal */}
      {accountModalOpen && (
        <div
          className="atelier-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Boutique Account"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAccountModalOpen(false);
          }}
        >
          <div className="atelier-modal-panel">
            <div className="atelier-modal-header">
              <div>
                <span className="atelier-modal-kicker">Botanical Concierge</span>
                <h3 className="atelier-modal-title">Atelier Member Space</h3>
              </div>
              <button
                type="button"
                className="atelier-modal-close"
                onClick={() => setAccountModalOpen(false)}
                aria-label="Close account panel"
              >
                ✕
              </button>
            </div>

            <div className="atelier-modal-body">
              <div className="atelier-status-card">
                <div className="atelier-status-row">
                  <span>Current Bag</span>
                  <strong>
                    {cartCount} {cartCount === 1 ? 'item' : 'items'} • ₹{cartTotal.toFixed(0)}
                  </strong>
                </div>
                <p className="atelier-status-note">
                  {cartTotal >= 150
                    ? '✦ You have unlocked Complimentary Next-Day Delivery.'
                    : `Add ₹${(150 - cartTotal).toFixed(0)} more for complimentary next-day boutique delivery.`}
                </p>
                <button
                  type="button"
                  className="atelier-cart-link"
                  onClick={() => {
                    setAccountModalOpen(false);
                    openCart();
                  }}
                >
                  Open Shopping Cart →
                </button>
              </div>

              {memberSignedIn ? (
                <div className="atelier-member-signed">
                  <p className="atelier-signed-heading">Welcome back to Twirl & Flora</p>
                  <p className="atelier-signed-email">{memberEmail}</p>
                  <p className="atelier-signed-desc">
                    Seasonal previews and bespoke floral care notes are active for this session.
                  </p>
                  <button
                    type="button"
                    className="atelier-signout-btn"
                    onClick={() => {
                      setMemberSignedIn(false);
                      setMemberEmail('');
                    }}
                  >
                    Switch Email
                  </button>
                </div>
              ) : (
                <form className="atelier-signin-form" onSubmit={handleAccountSubmit} noValidate>
                  <label htmlFor="atelier-member-email" className="atelier-form-label">
                    Receive order updates &amp; seasonal atelier access
                  </label>
                  <input
                    id="atelier-member-email"
                    type="email"
                    placeholder="you@example.com"
                    value={memberEmail}
                    onChange={(e) => {
                      setMemberEmail(e.target.value);
                      if (memberError) setMemberError('');
                    }}
                    className="atelier-email-input"
                  />
                  {memberError && <p className="atelier-error-text">{memberError}</p>}
                  <button type="submit" className="btn btn-primary atelier-submit-btn">
                    Continue as Guest Member
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
