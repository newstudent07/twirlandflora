import React from 'react';
import './NewsletterBanner.css';

const NewsletterBanner = () => {
  return (
    <section className="newsletter-banner">
      <div className="container newsletter-container">
        <div className="newsletter-content reveal">
          <h2>Join Our Floral Journal</h2>
          <p>Subscribe for exclusive early access to seasonal collections and care tips.</p>
          <div className="newsletter-input-group">
            <input type="email" placeholder="Email address" className="newsletter-input" />
            <button className="btn btn-primary newsletter-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
