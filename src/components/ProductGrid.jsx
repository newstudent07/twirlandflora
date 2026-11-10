import React from 'react';
import { motion } from 'framer-motion';
import AddToCartButton from './AddToCartButton';
import './ProductGrid.css';

const ProductGrid = ({ title = "Best Sellers", products = [] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <section className="product-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-lg">{title}</h2>
        </motion.div>
        
        <motion.div
          className="product-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {products.map((product) => {
            return (
              <motion.div
                key={product.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
                className="card product-card"
              >
                <div className="product-image-container">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                    whileHover={{ scale: 1.05 }}
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
        </motion.div>
      </div>
    </section>
  );
};

export default ProductGrid;
