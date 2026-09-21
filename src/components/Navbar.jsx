import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccountDropdown from './AccountDropdown';
import { ASSET_PATHS, handleImageError } from '../lib/assets';

export default function Navbar({ onOpenCompat, onOpenTracker }) {
  const { totalItemsCount, openCart, currentView, setCurrentView } = useCart();
  const { isCustomer, isAdmin, profile, logout } = useAuth();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    const closeAtDesktopWidth = () => {
      if (window.innerWidth > 1180) setMobileOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeAtDesktopWidth);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeAtDesktopWidth);
    };
  }, [mobileOpen]);

  const handleNav = (viewName, hashTarget = null) => {
    if (window.location.pathname !== '/') navigate('/');
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

  const handleTrackOrder = () => {
    navigate(isCustomer && !isAdmin ? '/account/orders' : '/track-order');
    setMobileOpen(false);
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
              <img src={ASSET_PATHS.logo} alt="ShopXzetio Logo" className="pro-brand-logo" onError={handleImageError} />
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
              <div className="nav-account-actions">
                {isAdmin
                  ? <button className="nav-account-link" onClick={() => navigate('/admin')}><i className="fa-solid fa-shield-halved"/><span>Admin</span></button>
                  : <AccountDropdown profile={profile} onLogout={logout} onTrackOrder={handleTrackOrder} isAuthenticated={isCustomer}/>
                }
              </div>

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
                onClick={() => setMobileOpen((value) => !value)}
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileOpen}
                aria-controls="storefront-mobile-menu"
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
          <div className="pro-mobile-drawer" id="storefront-mobile-menu" role="dialog" aria-modal="true" aria-label="Store navigation" onClick={(e) => e.stopPropagation()}>
            <div className="pro-mobile-header">
              <div className="pro-brand">
                <img src={ASSET_PATHS.logo} alt="ShopXzetio Logo" className="pro-brand-logo" onError={handleImageError} />
                <span className="pro-brand-title">SHOP<span>XZETIO</span></span>
              </div>
              <button className="pro-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation menu">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Mobile Quick Action Banner (Matcher) */}
            <div className="pro-mobile-actions-single">
              <button 
                className="pro-mobile-action-card card-matcher full-width"
                onClick={() => { setMobileOpen(false); onOpenCompat(); }}
              >
                <div className="action-card-icon">
                  <i className="fa-solid fa-mobile-screen-button"></i>
                </div>
                <div className="action-card-text">
                  <strong>Device Matcher</strong>
                  <span>Find compatible coolers & gear for your phone</span>
                </div>
              </button>
            </div>

            <div className="pro-mobile-nav">
              <div className="pro-mobile-account-group">
                <span className="pro-mobile-group-label">Account &amp; Orders</span>
                {isCustomer
                  ? <button className="pro-mobile-link-btn" onClick={() => { navigate(isAdmin ? '/admin' : '/account'); setMobileOpen(false); }}><i className={`fa-solid ${isAdmin ? 'fa-shield-halved' : 'fa-user'}`}/> {isAdmin ? 'Admin Portal' : 'My Account'}</button>
                  : <button className="pro-mobile-link-btn" onClick={() => { navigate('/login'); setMobileOpen(false); }}><i className="fa-solid fa-user"/> Sign In / Account</button>}
                <button className="pro-mobile-link-btn mobile-track-order" onClick={handleTrackOrder}><i className="fa-solid fa-box-location-dot"/> Track Order</button>
                {isCustomer && <button className="pro-mobile-link-btn" onClick={() => { logout(); setMobileOpen(false); }}><i className="fa-solid fa-right-from-bracket"/> Logout</button>}
              </div>
              <button 
                className={`pro-mobile-link-btn ${(!currentView || currentView === 'home') ? 'active' : ''}`}
                onClick={() => handleNav('home')}
              >
                <i className="fa-solid fa-house"></i> Home Base
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
              <div className="pro-mobile-policy-strip">
                <span>🛡️ 7 Days Warranty</span>
                <span>💵 COD Nationwide</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
