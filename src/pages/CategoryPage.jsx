import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import AddToCartButton from '../components/AddToCartButton';
import { LinePath } from '../components/DemoSkiper19';
import Cute404Page from '../components/Story';
import './CategoryPage.css';

// Rich, curated category definitions with bespoke 3D hero visual configs & products
const CATEGORY_CONFIG = {
  keychains: {
    title: (
      <>
        BOTANICAL <span style={{ color: '#CA7D7C' }}>CRYSTAL</span> KEYCHAINS
      </>
    ),
    subtitle: "Charming botanical keepsakes encased in crystal resin with delicate dried florals and pure 24K gold foil.",
    badgeText: "Bespoke Botanical Keepsakes",
    itemNoun: "keepsake",
    itemNounPlural: "keepsakes",
    visual: {
      image: '/keychain_hero.jpg',
      alt: 'Bespoke Botanical Floral Keychain with Real Preserved Blooms and 24K Gold Leaf',
      badgeText: 'Handcrafted Botanical Resin',
      specsLabel: 'BESPOKE COLLECTION',
      specsTitle: 'Real Preserved Petals & 24K Leaf',
      sealText: '• TWIRL & FLORA • ARTISAN BOTANICALS',
      sealIcon: '✤',
    },
    filterButtons: [
      { id: 'all', label: 'All Keepsakes' },
      { id: 'under-35', label: 'Under ₹35' },
      { id: 'bestseller', label: 'Bestsellers' },
      { id: 'top-rated', label: 'Top Rated (★ 4.9+)' },
    ],
    products: [
      {
        id: 'keychain-1',
        name: 'The Hexagon Rose Keepsake',
        price: '₹38',
        numericPrice: 38,
        rating: '★ 5.0',
        tag: 'Bestseller',
        image: '/keychain_hero.jpg',
        description: 'Preserved blush rose petals & 24K gold leaf flakes encased in crystal-clear hexagonal eco-resin.',
      },
      {
        id: 'keychain-2',
        name: 'Artisan Lavender Trio Keyring',
        price: '₹34',
        numericPrice: 34,
        rating: '★ 4.9',
        tag: 'Artisan Choice',
        image: '/keychain_product_2.jpg',
        description: 'French dried lavender, buttercups, and eucalyptus foliage set with brushed champagne brass clasp.',
      },
      {
        id: 'keychain-3',
        name: 'Golden Hour Botanical Keyring',
        price: '₹42',
        numericPrice: 42,
        rating: '★ 5.0',
        tag: 'Staff Favorite',
        image: '/keychain_hero.jpg',
        description: 'Sunset peach petals and rich gold leaf flakes crafted with an ultra-polished jewel finish.',
      },
      {
        id: 'keychain-4',
        name: 'Petite Teardrop Flora Charm',
        price: '₹28',
        numericPrice: 28,
        rating: '★ 4.8',
        tag: 'Under ₹35',
        image: '/keychain_product_2.jpg',
        description: 'Teardrop silhouette capturing delicate yellow petals and gold leaf flecks for everyday elegance.',
      },
      {
        id: 'keychain-5',
        name: 'Grand Prism Botanical Keepsake',
        price: '₹48',
        numericPrice: 48,
        rating: '★ 4.9',
        tag: 'Luxury',
        image: '/keychain_hero.jpg',
        description: 'Bespoke crystal resin silhouette featuring layered real dried botanicals and 24K gold foil.',
      },
      {
        id: 'keychain-6',
        name: 'Artisan Cylindrical Botanical Bar',
        price: '₹32',
        numericPrice: 32,
        rating: '★ 4.9',
        tag: 'Signature',
        image: '/keychain_product_2.jpg',
        description: 'Slim rectangular bar encasing wild botanicals and gold leaf with heavy-duty swivel keyring.',
      },
    ],
  },
  bouquets: {
    title: (
      <>
        ARTISAN <span style={{ color: '#CA7D7C' }}>LUXURY</span> BOUQUETS
      </>
    ),
    subtitle: "Hand-tied, voluminous arrangements of garden roses, peonies, and seasonal botanical stems.",
    badgeText: "Hand-Tied Botanical Arrangements",
    itemNoun: "bouquet",
    itemNounPlural: "bouquets",
    visual: {
      image: '/bouquet_hero.jpg',
      alt: 'Artisan Luxury Hand-Tied Botanical Floral Bouquet',
      badgeText: 'Fresh Hand-Tied Garden Stems',
      specsLabel: 'SIGNATURE COLLECTION',
      specsTitle: 'Garden Peonies, Roses & Ranunculus',
      sealText: '• TWIRL & FLORA • ARTISAN BOTANICALS',
      sealIcon: '❀',
    },
    filterButtons: [
      { id: 'all', label: 'All Bouquets' },
      { id: 'under-80', label: 'Under ₹80' },
      { id: 'bestseller', label: 'Bestsellers' },
      { id: 'top-rated', label: 'Top Rated (★ 4.9+)' },
    ],
    products: [
      {
        id: 'bouquet-1',
        name: 'The Royal Peony & Rose Symphony',
        price: '₹89',
        numericPrice: 89,
        rating: '★ 5.0',
        tag: 'Bestseller',
        image: '/bouquet_hero.jpg',
        description: 'Voluminous hand-tied blush peony blooms, garden roses, and silver dollar eucalyptus tied in silk.',
      },
      {
        id: 'bouquet-2',
        name: 'Sunset Coral Garden Gathering',
        price: '₹95',
        numericPrice: 95,
        rating: '★ 4.9',
        tag: 'Staff Favorite',
        image: '/hero_floral_3.jpg',
        description: 'Golden hour peach ranunculus, coral petals, and delicate seasonal wildflowers in full glory.',
      },
      {
        id: 'bouquet-3',
        name: 'Velvet Blanche Bridal Bouquet',
        price: '₹110',
        numericPrice: 110,
        rating: '★ 5.0',
        tag: 'Luxury',
        image: '/hero_floral_2.jpg',
        description: 'Opulent white ranunculus, ivory garden roses, and trailing jasmine vines for momentous occasions.',
      },
      {
        id: 'bouquet-4',
        name: 'The French Countryside Bundle',
        price: '₹75',
        numericPrice: 75,
        rating: '★ 4.8',
        tag: 'Under ₹80',
        image: '/product1.jpg',
        description: 'Rustic garden spray roses, dried lavender, and scented botanical stems wrapped in French parchment.',
      },
      {
        id: 'bouquet-5',
        name: 'Pastel Meadow Cloud Bouquet',
        price: '₹68',
        numericPrice: 68,
        rating: '★ 4.9',
        tag: 'Under ₹80',
        image: '/hero_floral.jpg',
        description: 'Airy soft pink sweet peas, blush carnations, and fluffy cream hydrangeas for effortless grace.',
      },
      {
        id: 'bouquet-6',
        name: 'Midnight Romance Botanical Wrap',
        price: '₹82',
        numericPrice: 82,
        rating: '★ 4.8',
        tag: 'Signature',
        image: '/product2.jpg',
        description: 'Deep berry tones, dusky garden foliage, and velvet garden roses tied with double satin.',
      },
    ],
  },
  'pot-flowers': {
    title: (
      <>
        EVERLASTING <span style={{ color: '#CA7D7C' }}>POTTED</span> BLOOMS
      </>
    ),
    subtitle: "Everlasting potted arrangements designed to bring timeless greenery, sculpted ceramic, and warmth to any interior.",
    badgeText: "Everlasting Potted Living Flora",
    itemNoun: "arrangement",
    itemNounPlural: "arrangements",
    visual: {
      image: '/pot_flower_hero.jpg',
      alt: 'Everlasting Botanical Potted Floral Arrangement',
      badgeText: 'Everlasting Potted Florals',
      specsLabel: 'LIVING FLORA DESIGN',
      specsTitle: 'Fluted Ceramic & Cyclamen Blooms',
      sealText: '• TWIRL & FLORA • EVERLASTING BLOOMS',
      sealIcon: '🌿',
    },
    filterButtons: [
      { id: 'all', label: 'All Potted Blooms' },
      { id: 'under-60', label: 'Under ₹60' },
      { id: 'bestseller', label: 'Bestsellers' },
      { id: 'top-rated', label: 'Top Rated (★ 4.9+)' },
    ],
    products: [
      {
        id: 'pot-1',
        name: 'The Fluted Cyclamen Ceramic Bowl',
        price: '₹65',
        numericPrice: 65,
        rating: '★ 5.0',
        tag: 'Bestseller',
        image: '/pot_flower_hero.jpg',
        description: 'Lush magenta and ivory cyclamen blooms with variegated foliage in a fluted artisan ceramic planter.',
      },
      {
        id: 'pot-2',
        name: 'Terracotta Garden Peony Pot',
        price: '₹58',
        numericPrice: 58,
        rating: '★ 4.9',
        tag: 'Artisan Choice',
        image: '/hero_floral_2.jpg',
        description: 'A charming arrangement of everlasting garden peonies and trailing ivy nestled in aged Tuscan clay.',
      },
      {
        id: 'pot-3',
        name: 'Minimalist Glazed Ranunculus Planter',
        price: '₹72',
        numericPrice: 72,
        rating: '★ 4.9',
        tag: 'Luxury',
        image: '/product2.jpg',
        description: 'Soft ivory ranunculus stems and lush green moss set in a handcrafted ivory stoneware pot.',
      },
      {
        id: 'pot-4',
        name: 'The Petite Botanist Herbarium Pot',
        price: '₹44',
        numericPrice: 44,
        rating: '★ 4.8',
        tag: 'Under ₹60',
        image: '/hero_floral_3.jpg',
        description: 'Everlasting miniature garden flora with delicate textured greenery in a textured stone vessel.',
      },
      {
        id: 'pot-5',
        name: 'Chalk White Hydrangea Planter',
        price: '₹85',
        numericPrice: 85,
        rating: '★ 5.0',
        tag: 'Staff Favorite',
        image: '/hero_floral.jpg',
        description: 'Generous cloud of everlasting hydrangeas and dried foliage in an architectural fluted planter.',
      },
      {
        id: 'pot-6',
        name: 'Artisan Moss & Wildflower Vessel',
        price: '₹48',
        numericPrice: 48,
        rating: '★ 4.8',
        tag: 'Signature',
        image: '/product1.jpg',
        description: 'Preserved forest moss, wild spray roses, and dried seed pods in a rustic ceramic compote.',
      },
    ],
  },
  'single-flowers': {
    title: (
      <>
        SCULPTURAL <span style={{ color: '#CA7D7C' }}>SOLITARY</span> STEMS
      </>
    ),
    subtitle: "Carefully preserved solitary stems celebrating the architectural minimalism and sculptural elegance of nature.",
    badgeText: "Sculptural Solitary Fine Stems",
    itemNoun: "stem",
    itemNounPlural: "stems",
    visual: {
      image: '/single_flower_hero.jpg',
      alt: 'Sculptural Solitary Botanical Stem in Minimal Glass Vase',
      badgeText: 'Sculptural Solitary Stems',
      specsLabel: 'SOLITARY ELEGANCE',
      specsTitle: 'Velvety English Garden Rose Stem',
      sealText: '• TWIRL & FLORA • TIMELESS STEMS',
      sealIcon: '✧',
    },
    filterButtons: [
      { id: 'all', label: 'All Single Stems' },
      { id: 'under-25', label: 'Under ₹25' },
      { id: 'bestseller', label: 'Bestsellers' },
      { id: 'top-rated', label: 'Top Rated (★ 4.9+)' },
    ],
    products: [
      {
        id: 'single-1',
        name: 'The Sculptural English Garden Rose',
        price: '₹24',
        numericPrice: 24,
        rating: '★ 5.0',
        tag: 'Bestseller',
        image: '/single_flower_hero.jpg',
        description: 'A single, breathtaking blush rose with velvety petals and natural stem, standing in minimalist perfection.',
      },
      {
        id: 'single-2',
        name: 'The Velvety Peach Peony Stem',
        price: '₹28',
        numericPrice: 28,
        rating: '★ 4.9',
        tag: 'Staff Favorite',
        image: '/product1.jpg',
        description: 'Full-bloom Japanese peony stem featuring layered ruffled petals and lush dewy green leaves.',
      },
      {
        id: 'single-3',
        name: 'The Solitary White Calla Lily',
        price: '₹22',
        numericPrice: 22,
        rating: '★ 4.8',
        tag: 'Artisan Choice',
        image: '/product2.jpg',
        description: 'Graceful architectural stem with smooth ivory trumpet petal for refined minimalist spaces.',
      },
      {
        id: 'single-4',
        name: 'Blush Ranunculus Solitaire',
        price: '₹18',
        numericPrice: 18,
        rating: '★ 4.9',
        tag: 'Under ₹25',
        image: '/hero_floral_2.jpg',
        description: 'Intricately layered spiral petals preserved to maintain natural softness and vibrant blush hue.',
      },
      {
        id: 'single-5',
        name: 'The Imperial French Garden Dahlia',
        price: '₹26',
        numericPrice: 26,
        rating: '★ 5.0',
        tag: 'Luxury',
        image: '/hero_floral_3.jpg',
        description: 'Striking geometric petal arrangement on a tall, slender stem for dramatic solitary vase styling.',
      },
      {
        id: 'single-6',
        name: 'Delicate Wild Cherry Blossom Stem',
        price: '₹20',
        numericPrice: 20,
        rating: '★ 4.8',
        tag: 'Signature',
        image: '/hero_floral.jpg',
        description: 'Slender woody branch dotted with everlasting pale pink blossoms and gentle buds.',
      },
    ],
  },
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { scrollYProgress } = useScroll();
  const [activeFilter, setActiveFilter] = useState('all');
  const [addedItem, setAddedItem] = useState(null);

  // Format and normalize category slug safely
  const rawSlug = (categoryId || 'all-flowers').toLowerCase();

  let normalizedKey = rawSlug;
  if (rawSlug === 'keychain' || rawSlug === 'keychains') {
    normalizedKey = 'keychains';
  } else if (rawSlug === 'bouquet' || rawSlug === 'bouquets') {
    normalizedKey = 'bouquets';
  } else if (
    rawSlug === 'pot-flower' ||
    rawSlug === 'pot-flowers' ||
    rawSlug === 'pot flower' ||
    rawSlug === 'pot flowers'
  ) {
    normalizedKey = 'pot-flowers';
  } else if (
    rawSlug === 'single-flower' ||
    rawSlug === 'single-flowers' ||
    rawSlug === 'single flower' ||
    rawSlug === 'single flowers'
  ) {
    normalizedKey = 'single-flowers';
  }

  const formattedCategory = rawSlug.replace(/-/g, ' ');

  // Retrieve category configuration with luxury fallback
  const config = useMemo(() => {
    if (CATEGORY_CONFIG[normalizedKey]) {
      return CATEGORY_CONFIG[normalizedKey];
    }
    return {
      title: (
        <>
          CURATED <span style={{ color: '#CA7D7C' }}>BOTANICAL</span> {formattedCategory.toUpperCase()}
        </>
      ),
      subtitle: `Explore our hand-crafted selection of ${formattedCategory}, perfect for any interior or celebration.`,
      badgeText: 'Curated Botanical Collection',
      itemNoun: 'creation',
      itemNounPlural: 'creations',
      visual: {
        image: '/hero_floral_2.jpg',
        alt: `Curated ${formattedCategory} Botanical Showcase`,
        badgeText: 'Bespoke Botanical Design',
        specsLabel: 'CURATED SELECTION',
        specsTitle: 'Handcrafted Florals & Foliage',
        sealText: '• TWIRL & FLORA • ARTISAN BOTANICALS',
        sealIcon: '✤',
      },
      filterButtons: [
        { id: 'all', label: 'All Creations' },
        { id: 'under-75', label: 'Under ₹75' },
        { id: 'bestseller', label: 'Bestsellers' },
        { id: 'top-rated', label: 'Top Rated (★ 4.9+)' },
      ],
      products: [
        {
          id: `${rawSlug}-1`,
          name: `The Royal ${formattedCategory} Arrangement`,
          price: '₹85',
          numericPrice: 85,
          rating: '★ 4.9',
          tag: 'Bestseller',
          image: '/hero_floral_2.jpg',
          description: 'Voluminous stems of blush peony, ivory ranunculus, and eucalyptus in bespoke ceramic.',
        },
        {
          id: `${rawSlug}-2`,
          name: `Artisan ${formattedCategory} Stem`,
          price: '₹60',
          numericPrice: 60,
          rating: '★ 4.8',
          tag: 'Artisan Choice',
          image: '/product1.jpg',
          description: 'Hand-picked and preserved for everlasting fragrance and velvety petal textures.',
        },
        {
          id: `${rawSlug}-3`,
          name: `Sunset Glow ${formattedCategory}`,
          price: '₹95',
          numericPrice: 95,
          rating: '★ 5.0',
          tag: 'Staff Favorite',
          image: '/hero_floral_3.jpg',
          description: 'Radiant coral, peach, and golden garden blooms evoking romantic golden hour.',
        },
        {
          id: `${rawSlug}-4`,
          name: `Classic ${formattedCategory} Petite`,
          price: '₹48',
          numericPrice: 48,
          rating: '★ 4.7',
          tag: 'Under ₹50',
          image: '/product2.jpg',
          description: 'Compact delicacy ideal for consoles, bedside tables, and thoughtful gifting.',
        },
        {
          id: `${rawSlug}-5`,
          name: `Grand Botanical ${formattedCategory}`,
          price: '₹120',
          numericPrice: 120,
          rating: '★ 4.9',
          tag: 'Luxury',
          image: '/hero_floral.jpg',
          description: 'An extravagant centerpiece displaying over thirty lush, voluminous seasonal stems.',
        },
        {
          id: `${rawSlug}-6`,
          name: `Velvet Noir ${formattedCategory}`,
          price: '₹75',
          numericPrice: 75,
          rating: '★ 4.9',
          tag: 'Signature',
          image: '/product1.jpg',
          description: 'Deep tones, eucalyptus fronds, and dramatic sculptural silhouettes for modern living.',
        },
      ],
    };
  }, [normalizedKey, rawSlug, formattedCategory]);

  // Reset filter when category changes
  const [prevKey, setPrevKey] = useState(normalizedKey);
  if (prevKey !== normalizedKey) {
    setPrevKey(normalizedKey);
    setActiveFilter('all');
  }

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [normalizedKey]);

  // Flexible Filter logic
  const filteredProducts = useMemo(() => {
    if (activeFilter === 'bestseller') {
      return config.products.filter((p) => p.tag === 'Bestseller' || p.tag === 'Luxury');
    }
    if (activeFilter === 'top-rated') {
      return config.products.filter((p) => p.rating.includes('5.0') || p.rating.includes('4.9'));
    }
    if (activeFilter.startsWith('under-')) {
      const maxPrice = parseInt(activeFilter.replace('under-', ''), 10);
      return config.products.filter((p) => p.numericPrice <= maxPrice);
    }
    return config.products;
  }, [config.products, activeFilter]);

  const handleAddToCart = (product) => {
    setAddedItem(product.name);
    setTimeout(() => {
      setAddedItem(null);
    }, 2400);
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.94,
      transition: { duration: 0.25 },
    },
  };

  if (normalizedKey === 'pot-flowers') {
    return <Cute404Page />;
  }

  return (
    <div className="category-page" key={normalizedKey}>
      {/* Background Animated Vine Scroll Trail */}
      <div className="category-vine-overlay">
        <LinePath
          scrollYProgress={scrollYProgress}
          stroke="#FF7597"
          strokeWidth={16}
          style={{
            filter: 'drop-shadow(0 0 10px rgba(255, 117, 151, 0.45))',
          }}
        />
      </div>

      <div className="category-content-wrap">
        {/* Animated 3D Hero Banner Showcase */}
        <Hero
          key={normalizedKey}
          title={config.title}
          subtitle={config.subtitle}
          visualProps={config.visual}
        />

        <div className="container">
          {/* Breadcrumbs & Badge Bar */}
          <motion.div
            className="category-top-bar"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="category-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="divider">/</span>
              <span>Collections</span>
              <span className="divider">/</span>
              <span className="current">{formattedCategory}</span>
            </nav>

            <motion.div
              className="category-badge-pill"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span>✦</span> {config.badgeText}
            </motion.div>
          </motion.div>

          {/* Interactive Filter Bar */}
          <motion.section
            className="category-filter-section"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="category-filter-bar">
              <div className="filter-pills-group">
                {config.filterButtons.map((btn) => {
                  const isActive = activeFilter === btn.id;
                  return (
                    <button
                      key={btn.id}
                      className={`filter-pill-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveFilter(btn.id)}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="categoryActiveFilter"
                          className="active-pill-bg"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      {btn.label}
                    </button>
                  );
                })}
              </div>

              <span className="filter-count-badge">
                Showing {filteredProducts.length} curated{' '}
                {filteredProducts.length === 1
                  ? config.itemNoun
                  : config.itemNounPlural}
              </span>
            </div>
          </motion.section>

          {/* Animated Product Grid */}
          <motion.div
            className="category-products-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                return (
                  <motion.div
                    key={product.id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
                    className="category-card"
                  >
                    <div className="category-image-wrap">
                      <span className="category-card-tag">{product.tag}</span>
                      <span className="category-card-rating">{product.rating}</span>
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="category-card-img"
                        loading="lazy"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>

                    <div className="category-card-info">
                      <h3 className="category-card-title">{product.name}</h3>
                      <p className="category-card-desc">{product.description}</p>

                      <div className="category-card-bottom">
                        <span className="category-card-price">{product.price}</span>
                        <AddToCartButton
                          product={product}
                          onAdd={handleAddToCart}
                          defaultText="Add to Cart"
                          addedText="Added"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Floating Added to Bag Toast */}
        <AnimatePresence>
          {addedItem && (
            <motion.div
              className="category-toast"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="toast-check-icon">✓</div>
              <div className="toast-text">
                Added <strong>"{addedItem}"</strong> to your cart
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
};

export default CategoryPage;
