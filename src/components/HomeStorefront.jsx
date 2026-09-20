import React from 'react';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';
import { useCatalog } from '../context/CatalogContext';

export default function HomeStorefront() {
  const { setCurrentView } = useCart();
  const { products } = useCatalog();

  // Curated 6-8 flagship products for Home Page
  const featuredProducts = (products.filter((product) => product.featured).length
    ? products.filter((product) => product.featured)
    : products).slice(0, 8);

  const categories = [
    {
      id: 'coolers',
      division: 'DIV 01 // TOURNAMENT CHILL',
      title: 'Phone Coolers',
      count: '8 Models',
      price: 'From Rs. 2,999',
      desc: 'Magnetic Peltier semiconductor radiators engineered for 120 FPS locked PUBG Mobile.',
      pills: ['❄️ -25°C Rapid Drop', '🧲 MagSafe & Clamp'],
      badge: 'TOP SELLER',
      icon: 'fa-snowflake',
      accent: '#8B5CF6',
      img: '/assets/products/PIVA B2/Hero Product.png'
    },
    {
      id: 'audio',
      division: 'DIV 02 // SPATIAL RADAR',
      title: 'Gaming Audio',
      count: '6 Models',
      price: 'From Rs. 1,499',
      desc: 'Studio acoustic headsets and tuned IEMs for pin-point micro-footstep detection.',
      pills: ['🎧 360° Spatial Footsteps', '🔊 53mm Dual Chambers'],
      badge: 'PRO TUNED',
      icon: 'fa-headphones',
      accent: '#EC4899',
      img: '/assets/products/Hyperx Cloud Kingston 2/hyperx_cloud_ii_red_1_main.webp'
    },
    {
      id: 'splitters',
      division: 'DIV 03 // DUAL BYPASS',
      title: 'DAC & Splitters',
      count: '5 Models',
      price: 'From Rs. 2,199',
      desc: 'Lossless 32-bit digital audio hubs with 60W concurrent device fast charging.',
      pills: ['⚡ 60W Fast Charge', '🎵 0ms DAC DSP'],
      badge: 'ZERO LAG',
      icon: 'fa-bolt',
      accent: '#06B6D4',
      img: '/assets/products/Piva GS1 Pro Type C/H1daa897c994447de980d8000665cb977H.jpg_960x960q80.jpg'
    },
    {
      id: 'accessories',
      division: 'DIV 04 // SPEED TACTICS',
      title: 'Accessories & Fans',
      count: '3 Models',
      price: 'From Rs. 499',
      desc: 'Conductive silver fiber finger sleeves and high-RPM portable desk tournament fans.',
      pills: ['🖐️ Zero-Drag Touch', '💨 Turbo Desk Airflow'],
      badge: 'PRECISION',
      icon: 'fa-gamepad',
      accent: '#10B981',
      img: '/assets/products/SLEEVES/1.png'
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
              style={{ '--cat-accent': cat.accent }}
            >
              {/* Reactive ambient backlight */}
              <div 
                className="cat-card-glow" 
                style={{ background: `radial-gradient(circle at 80% 50%, ${cat.accent}33 0%, ${cat.accent}11 40%, transparent 70%)` }} 
              />

              {/* Left Column: Tactical Details */}
              <div className="cat-card-left">
                <div className="cat-division-header">
                  <span className="cat-division-tag" style={{ color: cat.accent, borderColor: `${cat.accent}44` }}>
                    <i className={`fa-solid ${cat.icon}`}></i>
                    <span>{cat.division}</span>
                  </span>
                  <span className="cat-division-badge" style={{ background: `${cat.accent}22`, color: cat.accent, borderColor: `${cat.accent}55` }}>
                    {cat.badge}
                  </span>
                </div>

                <h3 className="cat-card-title">{cat.title}</h3>
                <p className="cat-card-desc">{cat.desc}</p>

                <div className="cat-pills-row">
                  {cat.pills.map((pill, idx) => (
                    <span key={idx} className="cat-pill">{pill}</span>
                  ))}
                </div>

                <div className="cat-card-footer">
                  <div className="cat-pricing-meta">
                    <span className="cat-count-badge">{cat.count}</span>
                    <span className="cat-price-from">{cat.price}</span>
                  </div>

                  <button className="btn-enter-division" style={{ borderColor: `${cat.accent}66` }}>
                    <span>ENTER DIVISION</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>

              {/* Right Column: 3D Floating Hardware Visual Stage */}
              <div className="cat-card-right-stage">
                <div className="cat-halo-ring" style={{ borderColor: `${cat.accent}33`, background: `radial-gradient(circle, ${cat.accent}22 0%, transparent 70%)` }} />
                <img src={cat.img} alt={cat.title} className="cat-hardware-img" loading="lazy" />
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
