import React from 'react';
import PRODUCTS from '../data/products';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';

export default function HomeStorefront() {
  const { setCurrentView } = useCart();

  // Curated 6-8 flagship products for Home Page
  const featuredProducts = PRODUCTS.slice(0, 8);

  const categories = [
    {
      id: 'coolers',
      title: 'Phone Coolers',
      count: '8 Products',
      desc: 'Magnetic Peltier & 20W Rapid Cryo Radiators',
      icon: 'fa-snowflake',
      accent: '#8B5CF6',
      img: '/assets/products/PIVA B2/Hero Product.png'
    },
    {
      id: 'audio',
      title: 'Gaming Audio',
      count: '6 Products',
      desc: 'Hi-Res Spatial Footstep Tracking Headsets',
      icon: 'fa-headphones',
      accent: '#EC4899',
      img: '/assets/products/HyperXCloud Alpha S/hyperx_cloud_alpha_s_blackblue_1_main.webp'
    },
    {
      id: 'splitters',
      title: 'DAC & Splitters',
      count: '5 Products',
      desc: '60W Fast Charging & 32-Bit Lossless Audio',
      icon: 'fa-bolt',
      accent: '#06B6D4',
      img: '/assets/products/Piva G71/H0c4571d770e84a559dbd2d25a0b73f42b.jpg_960x960q80.jpg'
    },
    {
      id: 'accessories',
      title: 'Accessories',
      count: '3 Products',
      desc: 'Zero-Friction Finger Sleeves & Desk Fans',
      icon: 'fa-gamepad',
      accent: '#10B981',
      img: '/assets/products/Cooler Fan/fan.jpg'
    }
  ];

  const handleNavCategory = (catId) => {
    setCurrentView(catId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-storefront-section">
      <div className="container">
        {/* Category Visual Explorer */}
        <div className="home-section-header">
          <div className="home-tag">SHOP BY CATEGORY</div>
          <h2 className="home-title">CHOOSE YOUR COMBAT DIVISION</h2>
          <p className="home-desc">Direct category portals engineered for tournament athletes.</p>
        </div>

        <div className="home-category-cards-grid">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="home-category-card"
              onClick={() => handleNavCategory(cat.id)}
            >
              <div className="cat-card-glow" style={{ background: `radial-gradient(circle, ${cat.accent}22 0%, transparent 70%)` }} />
              <div className="cat-card-icon" style={{ color: cat.accent, borderColor: `${cat.accent}44` }}>
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <div className="cat-card-details">
                <span className="cat-card-count">{cat.count}</span>
                <h3 className="cat-card-title">{cat.title}</h3>
                <p className="cat-card-desc">{cat.desc}</p>
              </div>
              <div className="cat-card-arrow">
                <span>Explore</span>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          ))}
        </div>

        {/* Curated Top Sellers in Daraz Grid */}
        <div className="home-flash-deals-wrap">
          <div className="deals-top-bar">
            <div className="deals-left-info">
              <div className="deals-badge">
                <i className="fa-solid fa-fire"></i> TOP PICKS
              </div>
              <h2 className="deals-title">FLASH DEALS & TOURNAMENT FAVORITES</h2>
            </div>

            <button 
              onClick={() => { setCurrentView('arsenal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="btn-view-all-arsenal"
            >
              <span>View All 22 Items</span>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {/* Daraz-Style Multi-Column Grid for Featured Items */}
          <div className="daraz-products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="deals-bottom-cta">
            <button 
              onClick={() => { setCurrentView('arsenal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="btn-explore-full-store cyber-cut"
            >
              <i className="fa-solid fa-boxes-stacked"></i>
              <span>VIEW FULL 22-PIECE TOURNAMENT ARSENAL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
