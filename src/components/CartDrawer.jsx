import React, { useEffect, useState } from 'react';
import { useCart } from '../context/useCart';
import './CartDrawer.css';

/**
 * CartDrawer
 * Clean, instant slide-over cart drawer to view and manage cart items.
 * No animation overhead, providing fast and direct interaction.
 */
const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    closeCart,
  } = useCart();

  const [checkoutMessage, setCheckoutMessage] = useState(false);

  const handleClose = () => {
    setCheckoutMessage(false);
    closeCart();
  };

  // Close cart on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) {
    return null;
  }

  const handleCheckout = () => {
    setCheckoutMessage(true);
    setTimeout(() => {
      setCheckoutMessage(false);
    }, 4000);
  };

  return (
    <div className="cart-drawer-root" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Backdrop overlay */}
      <div className="cart-drawer-backdrop" onClick={handleClose} />

      {/* Drawer Container (No animations, instant display) */}
      <div className="cart-drawer-panel">
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-wrap">
            <h2 className="cart-drawer-title">Your Cart</h2>
            <span className="cart-drawer-badge">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
          </div>
          <button
            type="button"
            className="cart-drawer-close-btn"
            onClick={handleClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="cart-shipping-banner">
          {cartTotal >= 150 ? (
            <p className="shipping-unlocked">
              <span>✦</span> You have unlocked <strong>Complimentary Next-Day Delivery</strong>!
            </p>
          ) : (
            <p className="shipping-progress">
              Add <strong>₹{(150 - cartTotal).toFixed(2)}</strong> more to qualify for complimentary delivery.
            </p>
          )}
        </div>

        {/* Drawer Content */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">❀</div>
              <h3 className="cart-empty-heading">Your cart is empty</h3>
              <p className="cart-empty-desc">
                Discover our curated collection of botanical resin keepsakes, fresh bouquets, and preserved florals.
              </p>
              <button
                type="button"
                className="cart-shop-now-btn"
                onClick={handleClose}
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-img-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img"
                    />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <button
                        type="button"
                        className="cart-item-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="cart-item-price-unit">{item.price}</div>

                    <div className="cart-item-bottom">
                      <div className="cart-qty-selector">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="cart-item-subtotal">
                        ₹{((item.numericPrice || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-row">
              <span className="subtotal-label">Subtotal</span>
              <span className="subtotal-val">₹{cartTotal.toFixed(2)}</span>
            </div>

            <p className="cart-tax-note">Taxes and shipping calculated at checkout.</p>

            {checkoutMessage && (
              <div className="cart-checkout-alert">
                <span>✓</span> Order simulation initiated. Ready for secure payment gateway.
              </div>
            )}

            <button
              type="button"
              className="cart-checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout • ₹{cartTotal.toFixed(2)}
            </button>

            <div className="cart-footer-actions">
              <button
                type="button"
                className="cart-clear-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                type="button"
                className="cart-continue-btn"
                onClick={handleClose}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
