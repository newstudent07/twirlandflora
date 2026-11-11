import React from 'react';
import { motion } from 'framer-motion';
import { useFineHover } from '@/lib/useFineHover';
import AddToCartButton from './AddToCartButton';
import './ProductGrid.css';

const ProductGrid = ({ title = "Best Sellers", products = [] }) => {
  const fineHover = useFineHover();

  const cardVariants = {
    hidden: { opacity: 0, y: 26, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <section className="product-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="mb-lg">{title}</h2>
        </motion.div>

        <div className="product-grid">
          {products.map((product, idx) => {
            return (
              <motion.div
                key={product.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.02 }}
                transition={{ delay: Math.min(idx * 0.06, 0.24) }}
                whileHover={fineHover ? { y: -8, transition: { duration: 0.25, ease: 'easeOut' } } : undefined}
                className="card product-card"
              >
                <div className="product-image-container">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                    loading="lazy"
                    whileHover={fineHover ? { scale: 1.05 } : undefined}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="product-info">
                  <div className="product-meta">
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-rating">{product.rating}</span>
                  </div>
                  <div className="product-action">
                    <span className="product-price">{product.price}</span>
                    <AddToCartButton
                      product={product}
                      defaultText="Add to Cart"
                      addedText="Added"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
