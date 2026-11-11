import React, { useEffect, useState } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/bodyScrollLock';
import { SOCIAL_LINKS } from '@/data/socials';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

const FOOTER_TOPICS = {
  privacy: {
    kicker: 'Botanical Privacy Charter',
    title: 'Privacy Policy',
    body: [
      'Twirl & Flora respects your privacy. Details entered into our journal or shopping bag stay within your local browser session and are never sold or shared with external brokers.',
      'Cart selections and ambient soundscape preferences (track selection and volume level) are persisted locally on your device for convenience.',
    ],
  },
  terms: {
    kicker: 'Boutique Service Guidelines',
    title: 'Terms of Service',
    body: [
      'Every bouquet, resin keepsake, and solitary stem is handcrafted to order in small batches using preserved and fresh seasonal botanicals.',
      'Complimentary next-day boutique delivery applies automatically on all orders over ₹150 across supported pincodes.',
    ],
  },
  care: {
    kicker: 'Everlasting Preservation',
    title: 'Bespoke Floral Care',
    body: [
      'Keep preserved florals and crystal resin keepsakes away from direct midday sunlight and humid steam to preserve petal vibrancy for years.',
      'For fresh hand-tied bouquets, trim stems diagonally by 1 cm every two days and refresh with cool filtered water.',
    ],
  },
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeState, setSubscribeState] = useState('idle'); // 'idle' | 'error' | 'subscribed'
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [socialNotice, setSocialNotice] = useState('');
  const [activeTopicKey, setActiveTopicKey] = useState(null);

  const activeTopic = activeTopicKey ? FOOTER_TOPICS[activeTopicKey] : null;

  useEffect(() => {
    if (activeTopicKey) {
      lockBodyScroll('footer-dialog');
    } else {
      unlockBodyScroll('footer-dialog');
    }
    return () => {
      unlockBodyScroll('footer-dialog');
    };
  }, [activeTopicKey]);

  useEffect(() => {
    if (!activeTopicKey) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveTopicKey(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeTopicKey]);

  const handleJournalSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setSubscribeState('error');
      setSubscribeMessage('Please enter a valid email address.');
      return;
    }
    setSubscribeState('subscribed');
    setSubscribeMessage(`Thank you — botanical updates will arrive at ${trimmed}.`);
    setEmail('');
  };

  const handleInactiveSocial = (platformName) => {
    setSocialNotice(
      `Our ${platformName} journal is blooming soon — visit @twirlandflora on Instagram for daily stems.`
    );
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          {/* Brand & Mission Column */}
          <div className="footer-brand-col reveal">
            <div className="footer-brand">Twirl & Flora</div>
            <p className="footer-bio">
              Elevating the art of floristry with curated, organic designs for everyday romance.
            </p>
            <div className="footer-social-links">
              <a
                href={SOCIAL_LINKS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {SOCIAL_LINKS.facebook.active ? (
                <a
                  href={SOCIAL_LINKS.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              ) : (
                <button
                  type="button"
                  className="social-icon"
                  aria-label="Facebook (coming soon)"
                  title="Facebook (coming soon)"
                  onClick={() => handleInactiveSocial('Facebook')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </button>
              )}

              {SOCIAL_LINKS.pinterest.active ? (
                <a
                  href={SOCIAL_LINKS.pinterest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label="Pinterest"
                  title="Pinterest"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.876 3.144-4.58 0-2.392-1.72-4.068-4.177-4.068-2.845 0-4.515 2.133-4.515 4.34 0 .859.331 1.781.745 2.281.082.099.094.187.069.286-.075.314-.243.993-.277 1.135-.045.186-.146.225-.338.136-1.258-.588-2.045-2.434-2.045-3.92 0-3.192 2.32-6.126 6.693-6.126 3.515 0 6.248 2.504 6.248 5.842 0 3.496-2.203 6.309-5.266 6.309-1.027 0-1.993-.534-2.322-1.164l-.634 2.417c-.23.874-.852 1.966-1.272 2.633 1.004.308 2.067.475 3.16.475 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                  </svg>
                </a>
              ) : (
                <button
                  type="button"
                  className="social-icon"
                  aria-label="Pinterest (coming soon)"
                  title="Pinterest (coming soon)"
                  onClick={() => handleInactiveSocial('Pinterest')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.876 3.144-4.58 0-2.392-1.72-4.068-4.177-4.068-2.845 0-4.515 2.133-4.515 4.34 0 .859.331 1.781.745 2.281.082.099.094.187.069.286-.075.314-.243.993-.277 1.135-.045.186-.146.225-.338.136-1.258-.588-2.045-2.434-2.045-3.92 0-3.192 2.32-6.126 6.693-6.126 3.515 0 6.248 2.504 6.248 5.842 0 3.496-2.203 6.309-5.266 6.309-1.027 0-1.993-.534-2.322-1.164l-.634 2.417c-.23.874-.852 1.966-1.272 2.633 1.004.308 2.067.475 3.16.475 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                  </svg>
                </button>
              )}
            </div>
            {socialNotice && (
              <p className="footer-social-notice" role="status" aria-live="polite">
                {socialNotice}
              </p>
            )}
          </div>

          {/* Journal Newsletter Column */}
          <div className="footer-journal-col reveal delay-1">
            <h4 className="footer-journal-heading">Join Our Journal</h4>
            <p className="footer-journal-subtext">
              Receive notes on botanical care, new collections, and exclusive boutique offerings.
            </p>
            <form className="footer-newsletter-form" onSubmit={handleJournalSubmit} noValidate>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (subscribeState === 'error') {
                    setSubscribeState('idle');
                    setSubscribeMessage('');
                  }
                }}
                placeholder="Email Address"
                aria-label="Footer journal email address"
                className="footer-input-pill"
                required
              />
              <button type="submit" className="btn btn-primary footer-subscribe-btn">
                {subscribeState === 'subscribed' ? 'Subscribed' : 'Subscribe'}
              </button>
            </form>
            {subscribeMessage && (
              <p
                className={`footer-subscribe-feedback ${
                  subscribeState === 'error' ? 'is-error' : 'is-success'
                }`}
                role="status"
                aria-live="polite"
              >
                {subscribeMessage}
              </p>
            )}
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom reveal delay-2">
          <span>&copy; {CURRENT_YEAR} Twirl & Flora. All rights reserved.</span>
          <div className="footer-bottom-links">
            <button type="button" className="footer-policy-btn" onClick={() => setActiveTopicKey('privacy')}>
              Privacy Policy
            </button>
            <span className="dot" aria-hidden="true">•</span>
            <button type="button" className="footer-policy-btn" onClick={() => setActiveTopicKey('terms')}>
              Terms of Service
            </button>
            <span className="dot" aria-hidden="true">•</span>
            <button type="button" className="footer-policy-btn" onClick={() => setActiveTopicKey('care')}>
              Bespoke Floral Care
            </button>
          </div>
        </div>
      </div>

      {/* Policy & Care Guide Modal */}
      {activeTopic && (
        <div
          className="footer-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={activeTopic.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveTopicKey(null);
          }}
        >
          <div className="footer-modal-panel">
            <div className="footer-modal-header">
              <div>
                <span className="footer-modal-kicker">{activeTopic.kicker}</span>
                <h3 className="footer-modal-title">{activeTopic.title}</h3>
              </div>
              <button
                type="button"
                className="footer-modal-close"
                onClick={() => setActiveTopicKey(null)}
                aria-label={`Close ${activeTopic.title}`}
              >
                ✕
              </button>
            </div>
            <div className="footer-modal-body">
              {activeTopic.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
