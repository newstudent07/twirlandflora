import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFineHover } from '@/lib/useFineHover';
import { useCart } from '../context/useCart';
import './AddToCartButton.css';

/**
 * AddToCartButton
 * A luxury micro-interaction button for adding botanical items to the cart.
 * Features:
 * - Fluid crossfade between "Add to Cart" and "Added" with gentle blur/slide
 * - Spring-loaded checkmark icon draw/entrance
 * - Botanical emerald color morph with soft ambient ripple
 * - Direct integration with CartContext
 */
const AddToCartButton = ({
  onAdd,
  product,
  className = '',
  defaultText = 'Add to Cart',
  addedText = 'Added',
  duration = 2400,
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const timerRef = useRef(null);
  const { addToCart } = useCart();
  const fineHover = useFineHover();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    if (isAdded) return;

    setIsAdded(true);

    if (addToCart && product) {
      addToCart(product);
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('twirl:cart-add', {
          detail: { product },
        })
      );
    }

    if (onAdd) {
      onAdd(product);
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsAdded(false);
      timerRef.current = null;
    }, duration);
  };

  return (
    <motion.button
      type="button"
      className={`luxury-cart-btn ${isAdded ? 'is-added' : ''} ${className}`}
      onClick={handleClick}
      layout
      whileHover={fineHover ? { scale: 1.03 } : undefined}
      whileTap={{ scale: 0.95 }}
      transition={{
        layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        scale: { type: 'spring', stiffness: 450, damping: 25 },
      }}
      aria-live="polite"
      aria-label={
        isAdded
          ? `${product?.name || 'Item'} added to cart`
          : `Add ${product?.name || 'item'} to cart`
      }
    >
      {/* Background Soft Pulse Glow */}
      <span className="cart-btn-glow" aria-hidden="true" />

      {/* Crossfade Text and Icon */}
      <AnimatePresence mode="wait" initial={false}>
        {isAdded ? (
          <motion.span
            key="added"
            className="cart-btn-content"
            initial={{ opacity: 0, y: 7, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -7, filter: 'blur(2px)' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.svg
              className="cart-check-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: [0, 1.25, 1], rotate: [-25, 8, 0] }}
              transition={{
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
            <span className="cart-btn-text">{addedText}</span>
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            className="cart-btn-content"
            initial={{ opacity: 0, y: -7, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 7, filter: 'blur(2px)' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              className="cart-plus-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="cart-btn-text">{defaultText}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AddToCartButton;
