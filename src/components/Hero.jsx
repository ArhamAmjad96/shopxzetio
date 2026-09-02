import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import PRODUCTS from '../data/products';
import LightPillar from './LightPillar';

const FLAGSHIP_SHOWCASE = [
  {
    id: 'piva-b2',
    category: 'CRYO COOLING',
    name: 'PIVA B2 Magnetic Semiconductor Cooler',
    price: 3850,
    origPrice: 4800,
    image: '/assets/products/PIVA B2/Hero Product.png',
    badge: '20W ULTRA FREEZE',
    stat: '-25°C RAPID DROP',
    icon: 'fa-snowflake',
    accent: '#8B5CF6'
  },
  {
    id: 'piva-g71',
    category: 'PRO AUDIO DAC',
    name: 'PIVA G71 Ultra Gaming Soundcard Hub',
    price: 11500,
    origPrice: 14000,
    image: '/assets/products/Piva G71/H0c4571d770e84a559dbd2d25a0b73f42b.jpg_960x960q80.jpg',
    badge: '32-BIT DSP + 65W PD',
    stat: '0MS SOUND LATENCY',
    icon: 'fa-bolt',
    accent: '#06B6D4'
  },
  {
    id: 'hyperx-cloud-alpha-s',
    category: 'ESPORTS AUDIO',
    name: 'HyperX Cloud Alpha S Pro Headset',
    price: 14500,
    origPrice: 17500,
    image: '/assets/products/HyperXCloud Alpha S/hyperx_cloud_alpha_s_blackblue_1_main.webp',
    badge: 'DUAL CHAMBER TECH',
    stat: '360° FOOTSTEP RADAR',
    icon: 'fa-headphones',
    accent: '#EC4899'
  }
];

export default function Hero() {
  const { addToCart, openDetail } = useCart();
  const [activeIdx, setActiveIdx] = useState(0);

  const activeProduct = FLAGSHIP_SHOWCASE[activeIdx];
  const fullProductData = PRODUCTS.find(p => p.id === activeProduct.id) || PRODUCTS[0];

  return (
    <section id="hero" className="hero-spacious-section">
      <div className="container hero-spacious-container">
        <div className="hero-spacious-grid">
          {/* Left Column: Brand Authority, Headline & CTAs */}
          <div className="hero-left-content">
            <div className="hero-pill-badge">
              <span className="badge-pulse-glow" />
              <span className="badge-label">PAKISTAN'S #1 ESPORTS ARSENAL</span>
              <span className="badge-verified">OFFICIAL GEAR</span>
            </div>

            <h1 className="hero-spacious-headline">
              DOMINATE EVERY <br />
              <span className="text-gradient-violet">TOURNAMENT.</span>
            </h1>

            <p className="hero-spacious-desc">
              Engineered for Pakistan's competitive PUBG Mobile, COD Mobile & FPS athletes. 
              Zero thermal throttling, 0ms lossless audio, and tournament-approved build quality.
            </p>

            {/* Clean, Spacious Guarantee Badges */}
            <div className="hero-guarantee-row">
              <div className="guarantee-pill">
                <i className="fa-solid fa-snowflake" style={{ color: '#8B5CF6' }}></i>
                <span>20W Cryo Chill (-25°C)</span>
              </div>
              <div className="guarantee-pill">
                <i className="fa-solid fa-bolt" style={{ color: '#06B6D4' }}></i>
                <span>0ms Lossless Audio DAC</span>
              </div>
              <div className="guarantee-pill">
                <i className="fa-solid fa-truck-fast" style={{ color: '#10B981' }}></i>
                <span>Nationwide Fast COD</span>
              </div>
            </div>

            {/* High-Impact Actions */}
            <div className="hero-actions-group">
              <a href="#catalog" className="btn-hero-gradient cyber-cut">
                <i className="fa-solid fa-cart-shopping"></i>
                <span>EXPLORE ARSENAL</span>
              </a>

              <a 
                href="https://wa.me/923348590229?text=Hello%20ShopXzetio!%20I%20want%20to%20consult%20about%20tournament%20gaming%20gear." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-hero-whatsapp-clean cyber-cut"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>WHATSAPP SUPPORT</span>
              </a>

              <a href="#inside-shopxzetio" className="btn-hero-outline">
                <i className="fa-solid fa-circle-play"></i>
                <span>PRO REVIEWS</span>
              </a>
            </div>
          </div>

          {/* Right Column: Clean Floating Spotlight Showcase */}
          <div className="hero-right-showcase">
            <div className="showcase-card glass-card">
              {/* Top Floating Badge */}
              <div className="showcase-top-tag">
                <span className="showcase-badge-pill">{activeProduct.badge}</span>
                <span className="showcase-stat-pill">
                  <i className={`fa-solid ${activeProduct.icon}`} style={{ color: activeProduct.accent }}></i>
                  {activeProduct.stat}
                </span>
              </div>

              {/* Center Floating High-Res Product Visual */}
              <div 
                className="showcase-visual-wrap" 
                onClick={() => openDetail(fullProductData)}
                title="Click to inspect full specs"
              >
                <div 
                  className="showcase-glow-halo" 
                  style={{ background: `radial-gradient(circle, ${activeProduct.accent}33 0%, transparent 70%)` }} 
                />
                <img 
                  key={activeProduct.id}
                  src={activeProduct.image} 
                  alt={activeProduct.name} 
                  className="showcase-product-img animate-float-clean"
                />
              </div>

              {/* Bottom Info & Quick Buy Bar */}
              <div className="showcase-info-bar">
                <div className="showcase-title-price">
                  <span className="showcase-category">{activeProduct.category}</span>
                  <h3 className="showcase-name" onClick={() => openDetail(fullProductData)}>
                    {activeProduct.name}
                  </h3>
                  <div className="showcase-price-box">
                    <span className="price-main">Rs. {activeProduct.price.toLocaleString()}</span>
                    {activeProduct.origPrice && (
                      <span className="price-slash">Rs. {activeProduct.origPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => addToCart(fullProductData, 1)}
                  className="btn-showcase-equip cyber-cut-sm"
                  title="Add to Armory Cart"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>EQUIP</span>
                </button>
              </div>

              {/* Loadout Switcher Pills */}
              <div className="showcase-switcher-tabs">
                {FLAGSHIP_SHOWCASE.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`switcher-tab-btn ${idx === activeIdx ? 'active' : ''}`}
                    style={idx === activeIdx ? { borderColor: item.accent, color: '#FFF' } : {}}
                  >
                    <i className={`fa-solid ${item.icon}`} style={{ color: item.accent }}></i>
                    <span>{`0${idx + 1}`}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
