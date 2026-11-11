import React, { useState } from 'react';
import './NewsletterBanner.css';

const NewsletterBanner = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'error' | 'subscribed'
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('subscribed');
    setMessage(`Welcome to the Floral Journal — notes will be sent to ${trimmed}.`);
    setEmail('');
  };

  return (
    <section className="newsletter-banner">
      <div className="container newsletter-container">
        <div className="newsletter-content reveal">
          <h2>Join Our Floral Journal</h2>
          <p>Subscribe for exclusive early access to seasonal collections and care tips.</p>
          <form className="newsletter-input-group" onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setMessage('');
                }
              }}
              placeholder="Email address"
              aria-label="Email address"
              className="newsletter-input"
              required
            />
            <button type="submit" className="btn btn-primary newsletter-btn">
              {status === 'subscribed' ? 'Subscribed' : 'Subscribe'}
            </button>
          </form>
          {message && (
            <p
              className={`newsletter-feedback ${status === 'error' ? 'is-error' : 'is-success'}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
