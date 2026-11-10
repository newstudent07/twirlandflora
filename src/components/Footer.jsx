import React from 'react';
import { SOCIAL_LINKS } from '@/data/socials';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
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
              <a
                href={SOCIAL_LINKS.facebook.url}
                className="social-icon"
                aria-label="Facebook"
                title="Facebook"
                {...(SOCIAL_LINKS.facebook.active ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.pinterest.url}
                className="social-icon"
                aria-label="Pinterest"
                title="Pinterest"
                {...(SOCIAL_LINKS.pinterest.active ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.876 3.144-4.58 0-2.392-1.72-4.068-4.177-4.068-2.845 0-4.515 2.133-4.515 4.34 0 .859.331 1.781.745 2.281.082.099.094.187.069.286-.075.314-.243.993-.277 1.135-.045.186-.146.225-.338.136-1.258-.588-2.045-2.434-2.045-3.92 0-3.192 2.32-6.126 6.693-6.126 3.515 0 6.248 2.504 6.248 5.842 0 3.496-2.203 6.309-5.266 6.309-1.027 0-1.993-.534-2.322-1.164l-.634 2.417c-.23.874-.852 1.966-1.272 2.633 1.004.308 2.067.475 3.16.475 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Journal Newsletter Column */}
          <div className="footer-journal-col reveal delay-1">
            <h4 className="footer-journal-heading">Join Our Journal</h4>
            <p className="footer-journal-subtext">
              Receive notes on botanical care, new collections, and exclusive boutique offerings.
            </p>
            <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="footer-input-pill"
                required
              />
              <button type="submit" className="btn btn-primary footer-subscribe-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom reveal delay-2">
          <span>&copy; {CURRENT_YEAR} Twirl & Flora. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="dot">•</span>
            <a href="#">Terms of Service</a>
            <span className="dot">•</span>
            <a href="#">Bespoke Floral Care</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
