import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';

const CategoryGrid = () => {
  const categories = [
    { name: "Keychains", slug: "keychains", img: "/keychain_hero.jpg" },
    { name: "Bouquets", slug: "bouquets", img: "/bouquet_hero.jpg" },
    { name: "Pot Flowers", slug: "pot-flowers", img: "/pot_flower_hero.jpg" },
    { name: "Single Flowers", slug: "single-flowers", img: "/single_flower_hero.jpg" },
    { name: "Anniversary", slug: "anniversary", img: "/hero_floral_3.jpg" },
  ];

  return (
    <section className="category-section">
      <div className="container" style={{ overflow: 'clip' }}>
        <h2 className="text-center mb-lg reveal">Shop by Category</h2>
        <div className="category-marquee-container reveal delay-1">
          <div className="category-grid">
            {[...categories, ...categories].map((cat, idx) => (
              <Link
                to={`/category/${cat.slug}`}
                className="category-card organic-arch"
                key={idx}
              >
                <img src={cat.img} alt={cat.name} className="category-img" />
                <div className="category-overlay">
                  <h3 className="category-title">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
