import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenCompat, onOpenTracker }) {
  const { totalItemsCount, openCart, currentView, setCurrentView } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (viewName, hashTarget = null) => {
    setCurrentView(viewName);
    setMobileOpen(false);
    if (hashTarget) {
      setTimeout(() => {
        const el = document.querySelector(hashTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`pro-navbar-sticky ${scrolled ? 'has-scrolled' : 'is-transparent'}`}>
        <div className="pro-nav-container">
          <nav className="pro-nav">
            {/* Left: Clean Brand Mark */}
            <button 
              className="pro-brand-btn"
              onClick={() => handleNav('home')}
            >
              <img src="/assets/brand/LOGO.png" alt="ShopXzetio Logo" className="pro-brand-logo" />
              <span className="pro-brand-title">
                SHOP<span>XZETIO</span>
              </span>
            </button>

            {/* Center: Clean Minimalist Navigation Links */}
            <div className="pro-nav-links">
              <button 
                className={`pro-nav-link ${(!currentView || currentView === 'home' || currentView === 'store') ? 'active' : ''}`}
                onClick={() => handleNav('home')}
              >
                Home
              </button>
              <button 
                className={`pro-nav-link ${currentView === 'coolers' ? 'active' : ''}`}
                onClick={() => handleNav('coolers')}
              >
                Coolers
              </button>
              <button 
                className={`pro-nav-link ${currentView === 'audio' ? 'active' : ''}`}
                onClick={() => handleNav('audio')}
              >
                Audio
              </button>
              <button 
                className={`pro-nav-link ${currentView === 'splitters' ? 'active' : ''}`}
                onClick={() => handleNav('splitters')}
              >
                Splitters
              </button>
              <button 
                className={`pro-nav-link ${currentView === 'arsenal' ? 'active' : ''}`}
                onClick={() => handleNav('arsenal')}
              >
                Arsenal
              </button>
              <button 
                className="pro-nav-link"
                onClick={() => handleNav('home', '#inside-shopxzetio')}
              >
                Reels
              </button>
              <button 
                className="pro-nav-link pro-nav-highlight"
                onClick={onOpenCompat}
              >
                <i className="fa-solid fa-mobile-screen-button"></i> Matcher
              </button>
            </div>

            {/* Right: Clean Pro Actions */}
            <div className="pro-nav-actions">
              {/* Order Tracking Button */}
              <button 
                onClick={onOpenTracker}
                className="pro-btn-action-nav"
                title="Track Courier Order"
              >
                <i className="fa-solid fa-truck-fast"></i>
                <span className="hide-on-mobile">Track</span>
              </button>

              {/* WhatsApp Support Button */}
              <a 
                href="https://wa.me/923348590229?text=Hello%20ShopXzetio!%20I%20have%20an%20inquiry%20regarding%20gaming%20gear." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="pro-btn-support"
                title="WhatsApp Support"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>Support</span>
              </a>

              {/* Minimalist Cart Button */}
              <button 
                className="pro-btn-cart" 
                onClick={openCart}
                aria-label="Open Armory Cart"
                title="Armory Cart"
              >
                <i className="fa-solid fa-cart-shopping"></i>
                {totalItemsCount > 0 && (
                  <span className="pro-cart-badge">{totalItemsCount}</span>
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button 
                className="pro-mobile-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle Navigation Menu"
              >
                <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="pro-mobile-backdrop" onClick={() => setMobileOpen(false)}>
          <div className="pro-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="pro-mobile-header">
              <div className="pro-brand">
                <img src="/assets/brand/LOGO.png" alt="ShopXzetio Logo" className="pro-brand-logo" />
                <span className="pro-brand-title">SHOP<span>XZETIO</span></span>
              </div>
              <button className="pro-mobile-close" onClick={() => setMobileOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="pro-mobile-nav">
              <button 
                className={`pro-mobile-link-btn ${(!currentView || currentView === 'home') ? 'active' : ''}`}
                onClick={() => handleNav('home')}
              >
                <i className="fa-solid fa-house"></i> Home
              </button>
              <button 
                className={`pro-mobile-link-btn ${currentView === 'coolers' ? 'active' : ''}`}
                onClick={() => handleNav('coolers')}
              >
                <i className="fa-solid fa-snowflake"></i> Phone Coolers
              </button>
              <button 
                className={`pro-mobile-link-btn ${currentView === 'audio' ? 'active' : ''}`}
                onClick={() => handleNav('audio')}
              >
                <i className="fa-solid fa-headphones"></i> Gaming Audio
              </button>
              <button 
                className={`pro-mobile-link-btn ${currentView === 'splitters' ? 'active' : ''}`}
                onClick={() => handleNav('splitters')}
              >
                <i className="fa-solid fa-bolt"></i> 60W DAC Splitters
              </button>
              <button 
                className={`pro-mobile-link-btn ${currentView === 'accessories' ? 'active' : ''}`}
                onClick={() => handleNav('accessories')}
              >
                <i className="fa-solid fa-gamepad"></i> Sleeves & Accessories
              </button>
              <button 
                className={`pro-mobile-link-btn ${currentView === 'arsenal' ? 'active' : ''}`}
                onClick={() => handleNav('arsenal')}
              >
                <i className="fa-solid fa-boxes-stacked"></i> Full 22-Gear Arsenal
              </button>
              <button 
                className="pro-mobile-link-btn"
                onClick={() => handleNav('home', '#inside-shopxzetio')}
              >
                <i className="fa-solid fa-circle-play"></i> Inside Xzetio Reels
              </button>
            </div>

            <div className="pro-mobile-footer">
              <a 
                href="https://wa.me/923348590229" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="pro-mobile-whatsapp-btn"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>Direct Helpline: 0334-8590229</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
