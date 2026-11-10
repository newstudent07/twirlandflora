import React from 'react'
import { useScroll } from 'framer-motion'
import Hero from '../components/Hero'
import ServiceStrip from '../components/ServiceStrip'
import CategoryGrid from '../components/CategoryGrid'
import ProductGrid from '../components/ProductGrid'
import NewsletterBanner from '../components/NewsletterBanner'
import Footer from '../components/Footer'
import { LinePath } from '../components/DemoSkiper19'

const Home = () => {
  const { scrollYProgress } = useScroll();

  const homeProducts = [
    {
      id: 1,
      name: "The Peony Paradigm",
      price: "₹85",
      rating: "★ 4.9",
      image: "/product1.jpg"
    },
    {
      id: 2,
      name: "Midsummer Night",
      price: "₹110",
      rating: "★ 4.8",
      image: "/product2.jpg"
    },
    {
      id: 3,
      name: "Blushing Elegance",
      price: "₹95",
      rating: "★ 5.0",
      image: "/hero_floral.jpg"
    }
  ];

  return (
    <div className="home-container" style={{ position: 'relative', overflowX: 'clip', width: '100%' }}>
      {/* Dynamic Animated LinePath Scroll Effect extending till the end of the page */}
      <div
        className="home-vine-overlay"
        style={{
          position: 'absolute',
          top: '-90px', // Starts from the header (announcement bar + navbar)
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1440px',
          height: 'calc(100% + 90px)', // Spans all the way till the end of the page (including footer)
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 1,
        }}
      >
        <LinePath
          scrollYProgress={scrollYProgress}
          stroke="#FF7597"
          strokeWidth={16}
          style={{
            filter: 'drop-shadow(0 0 10px rgba(255, 117, 151, 0.45))',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <ServiceStrip />
        <CategoryGrid />
        <NewsletterBanner />
        <ProductGrid title="Best Sellers" products={homeProducts} />
        <Footer />
      </div>
    </div>
  )
}

export default Home
