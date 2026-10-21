import React, { useState, useMemo, useEffect } from 'react';
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
  const [isPaused, setIsPaused] = useState(false);

  // Compute the exact Top 3 spotlight products:
  // 1. Check specs.top_order (1, 2, 3) configured in Admin Panel
  // 2. Check localStorage saved top 3 product IDs
  // 3. Fallback to active hero & top products
  const showcaseProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const byOrder = [null, null, null];
    products.forEach((p) => {
      const order = Number(p.specs?.top_order);
      if (order >= 1 && order <= 3) {
        byOrder[order - 1] = p;
      }
    });

    let localSaved = [];
    try {
      localSaved = JSON.parse(localStorage.getItem('shopxzetio_top_3_products') || '[]');
    } catch {}

    const list = [];
    for (let i = 0; i < 3; i++) {
      if (byOrder[i]) {
        list.push(byOrder[i]);
      } else if (localSaved[i]) {
        const found = products.find(
          (p) => String(p.id) === String(localSaved[i]) || String(p.databaseId) === String(localSaved[i])
        );
        if (found && !list.some((x) => x.id === found.id)) {
          list.push(found);
        }
      }
    }

    if (list.length < 3) {
      const heroItem = products.find((p) => p.isHero && !list.some((x) => x.id === p.id));
      if (heroItem) list.push(heroItem);
    }
    if (list.length < 3) {
      const featuredItems = products.filter((p) => p.featured && !list.some((x) => x.id === p.id));
      list.push(...featuredItems);
    }
    if (list.length < 3) {
      const remaining = products.filter((p) => !list.some((x) => x.id === p.id));
      list.push(...remaining);
    }

    return list.slice(0, 3);
  }, [products]);

  // Smooth automatic rotation every 5 seconds
  useEffect(() => {
    if (showcaseProducts.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % showcaseProducts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [showcaseProducts.length, isPaused]);

  useEffect(() => {
    if (activeIdx >= showcaseProducts.length && showcaseProducts.length > 0) {
      setActiveIdx(0);
    }
  }, [showcaseProducts.length, activeIdx]);

  const activeProduct = showcaseProducts[activeIdx] || showcaseProducts[0] || products?.[0];
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
          <div
            className="hero-right-showcase"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div key={activeProduct.id || activeIdx} className="showcase-card glass-card basic-card-transition">
              {/* Top Tag */}
              <div className="showcase-top-tag">
                <span className="showcase-badge-pill" style={{ color: meta.accent, borderColor: `${meta.accent}55` }}>
                  <i className={`fa-solid ${meta.icon}`} style={{ marginRight: '6px' }} />
                  {activeProduct.badge || 'TOP SPOTLIGHT'}
                </span>
                <span className="showcase-stat-pill">
                  {`0${activeIdx + 1} / 0${showcaseProducts.length}`}
                </span>
              </div>

              {/* Center Floating High-Res Product Visual */}
              <div
                className="showcase-visual-wrap"
                onClick={() => openDetail(activeProduct)}
                title="Click to inspect full specs"
              >
                <div
                  className="showcase-glow-halo"
                  style={{ background: `radial-gradient(circle, ${meta.accent}44 0%, transparent 70%)` }}
                />
                <img
                  key={mainImage}
                  src={mainImage}
                  alt={activeProduct.name}
                  className="showcase-product-img fit-contain"
                  onError={handleImageError}
                />
              </div>

              {/* Bottom Info & Quick Buy Bar */}
              <div className="showcase-info-bar">
                <div className="showcase-title-price">
                  <span className="showcase-category">{activeProduct.category?.toUpperCase()}</span>
                  <h3
                    className="showcase-name"
                    onClick={() => openDetail(activeProduct)}
                  >
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
            </div>

            {/* Clean Indicator Dots */}
            {showcaseProducts.length > 1 && (
              <div className="showcase-auto-indicator" aria-label="Rotating spotlight products">
                {showcaseProducts.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`indicator-dot ${idx === activeIdx ? 'active' : ''}`}
                    title={`Spotlight Product 0${idx + 1}`}
                    aria-label={`View spotlight product ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
