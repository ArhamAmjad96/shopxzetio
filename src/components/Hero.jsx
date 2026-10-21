import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useCatalog } from '../context/CatalogContext';
import { handleImageError, normalizeAssetUrl } from '../lib/assets';

function getCategoryMeta(category = '') {
  const cat = String(category).toLowerCase();
  if (cat.includes('cooler') || cat.includes('cooling')) {
    return { icon: 'fa-snowflake', accent: '#8B5CF6' };
  }
  if (cat.includes('audio') || cat.includes('headset') || cat.includes('earbud')) {
    return { icon: 'fa-headphones', accent: '#EC4899' };
  }
  if (cat.includes('splitter') || cat.includes('dac')) {
    return { icon: 'fa-bolt', accent: '#06B6D4' };
  }
  return { icon: 'fa-gamepad', accent: '#10B981' };
}

export default function Hero() {
  const { addToCart, openDetail } = useCart();
  const { products } = useCatalog();
  const [activeIdx, setActiveIdx] = useState(0);

  // Compute showcase products dynamically:
  // 1. Hero flagship product (marked isHero)
  // 2. Featured / Top products
  const showcaseProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const heroItem = products.find(p => p.isHero);
    const featuredItems = products.filter(p => p.featured && p.id !== heroItem?.id);
    const otherItems = products.filter(p => !p.featured && p.id !== heroItem?.id);

    const list = [];
    if (heroItem) list.push(heroItem);
    list.push(...featuredItems);
    if (list.length < 3) list.push(...otherItems);

    return list.slice(0, 4);
  }, [products]);

  // Safe boundary check
  const activeProduct = showcaseProducts[activeIdx] || showcaseProducts[0] || products[0];

  if (!activeProduct) return null;

  const meta = getCategoryMeta(activeProduct.category);
  const mainImage = normalizeAssetUrl(activeProduct.mainImage || activeProduct.images?.[0]);

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
              Tournament-ready gear for PUBG Mobile, COD Mobile & FPS. Stay cool, hear every step, and play at your peak.
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

              <a href="#pro-reviews" className="btn-hero-outline">
                <i className="fa-solid fa-angles-down"></i>
                <span>PRO REVIEWS</span>
              </a>
            </div>
          </div>

          {/* Right Column: Clean Floating Spotlight Showcase */}
          <div className="hero-right-showcase">
            <div className="showcase-card glass-card">

              {/* Center Floating High-Res Product Visual */}
              <div 
                className="showcase-visual-wrap" 
                onClick={() => openDetail(activeProduct)}
                title="Click to inspect full specs"
              >
                <div 
                  className="showcase-glow-halo" 
                  style={{ background: `radial-gradient(circle, ${meta.accent}33 0%, transparent 70%)` }} 
                />
                <img 
                  key={activeProduct.id}
                  src={mainImage} 
                  alt={activeProduct.name} 
                  className="showcase-product-img fit-contain animate-float-clean"
                  onError={handleImageError}
                />
              </div>

              {/* Bottom Info & Quick Buy Bar */}
              <div className="showcase-info-bar">
                <div className="showcase-title-price">
                  <span className="showcase-category">{activeProduct.category?.toUpperCase()}</span>
                  <h3 className="showcase-name" onClick={() => openDetail(activeProduct)}>
                    {activeProduct.name}
                  </h3>
                  <div className="showcase-price-box">
                    <span className="price-main">Rs. {Number(activeProduct.price).toLocaleString()}</span>
                    {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                      <span className="price-slash">Rs. {Number(activeProduct.originalPrice).toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => addToCart(activeProduct, 1)}
                  className="btn-showcase-equip cyber-cut-sm"
                  title="Add to Armory Cart"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>EQUIP</span>
                </button>
              </div>

              {/* Loadout Switcher Pills */}
              {showcaseProducts.length > 1 && (
                <div className="showcase-switcher-tabs">
                  {showcaseProducts.map((item, idx) => {
                    const itemMeta = getCategoryMeta(item.category);
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveIdx(idx)}
                        className={`switcher-tab-btn ${idx === activeIdx ? 'active' : ''}`}
                        style={idx === activeIdx ? { borderColor: itemMeta.accent, color: '#FFF' } : {}}
                        title={item.name}
                      >
                        <i className={`fa-solid ${itemMeta.icon}`} style={{ color: itemMeta.accent }}></i>
                        <span>{`0${idx + 1}`}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
