import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Carousel_002 } from '@/components/v1/skiper48';
import { useFineHover } from '@/lib/useFineHover';
import KeychainHeroVisual from './KeychainHeroVisual';
import './Hero.css';

const Hero = ({
  title = <>BIGGER. <span style={{ color: '#CA7D7C' }}>BRIGHTER.</span> BETTER.</>,
  subtitle = "Discover our new collection of voluminous, vibrant blooms crafted for unforgettable moments.",
  isKeychain = false,
  singleImage = null,
  visualProps = null,
  onActionClick = null,
}) => {
  const [loaded, setLoaded] = useState(false);
  const fineHover = useFineHover();

  useEffect(() => {
    // Trigger animation reliably after mount
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const heroImages = [
    {
      src: "/hero_floral.jpg",
      alt: "Voluminous Bright Florals Bouquet",
    },
    {
      src: "/hero_floral_2.jpg",
      alt: "Blush Peonies & Ranunculus Arrangement",
    },
    {
      src: "/hero_floral_3.jpg",
      alt: "Sunset Coral Botanical Masterpiece",
    },
    {
      src: "/product1.jpg",
      alt: "The Peony Paradigm",
    },
    {
      src: "/product2.jpg",
      alt: "Midsummer Night Luxury Stems",
    },
    {
      src: "/hero_floral_2.jpg",
      alt: "Artisan Peach Peony Bloom",
    },
  ];

  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick();
      return;
    }
    const target =
      document.querySelector('.category-filter-section') ||
      document.querySelector('.category-section') ||
      document.querySelector('.product-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className={`hero ${loaded ? 'hero-loaded' : ''}`}>
      <div className="container hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>
          <motion.button
            type="button"
            className="btn btn-primary"
            onClick={handleActionClick}
            whileHover={fineHover ? { scale: 1.04, boxShadow: "0 8px 24px rgba(202, 125, 124, 0.4)" } : undefined}
            whileTap={{ scale: 0.96 }}
          >
            Shop the Collection
          </motion.button>
        </motion.div>
        
        <div className="hero-image-wrapper">
          {visualProps || isKeychain || singleImage ? (
            <KeychainHeroVisual
              image={visualProps?.image || singleImage || "/keychain_hero.jpg"}
              alt={visualProps?.alt || "Bespoke Botanical Floral Showcase"}
              badgeText={visualProps?.badgeText}
              specsLabel={visualProps?.specsLabel}
              specsTitle={visualProps?.specsTitle}
              sealText={visualProps?.sealText}
              sealIcon={visualProps?.sealIcon}
            />
          ) : (
            <Carousel_002
              images={heroImages}
              showPagination={true}
              showNavigation={true}
              loop={true}
              autoplay={true}
              spaceBetween={40}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
