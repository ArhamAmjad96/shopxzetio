import React, { useState } from 'react';

const REVIEWS_DATA = [
  {
    id: 1,
    isPro: true,
    initials: '4T',
    name: '4T Falak',
    team: 'Team 4T Esports',
    role: 'PUBG Champion',
    badge: 'PRO ATHLETE',
    badgeIcon: 'fa-trophy',
    text: '"In competitive South Asian tournaments, a 1% FPS drop or missing a footstep cue loses the round. ShopXzetio is the only store in Pakistan providing authentic tournament hardware. The PIVA cooler and HyperX headset deliver 100% genuine performance."',
    gear: 'HyperX Cloud II & PIVA B2 Cooler',
    gearIcon: 'fa-crosshairs',
    accentColor: '#8B5CF6'
  },
  {
    id: 2,
    isPro: true,
    initials: 'i8',
    name: 'i8 Crypto',
    team: 'Team i8 Esports',
    role: 'Tier-1 Pro Athlete',
    badge: 'PRO ATHLETE',
    badgeIcon: 'fa-trophy',
    text: '"The PIVA GS1 Pro Type-C splitter allows continuous 60W charging with zero audio latency or crackling sound during intense 6-match tournament days. Fast COD shipping to Lahore within 2 days. 10/10 recommendation for all scrim grinders."',
    gear: 'PIVA GS1 Pro 60W DAC Adapter',
    gearIcon: 'fa-crosshairs',
    accentColor: '#06B6D4'
  },
  {
    id: 3,
    isPro: false,
    initials: 'HA',
    name: 'Hamza Ali',
    team: 'Karachi, Sindh',
    role: 'Competitive Scrims',
    badge: 'VERIFIED BUYER',
    badgeIcon: 'fa-circle-check',
    text: '"Received my PIVA B2 cooler today in Karachi. My iPhone 15 Pro Max used to drop from 120 FPS to 60 FPS in PUBG after 15 minutes due to thermal throttling. With this cooler, it stays at 120 FPS rock solid! Delivered via Cash on Delivery securely."',
    gear: 'PIVA B2 Magnetic Semiconductor Cooler',
    gearIcon: 'fa-bag-shopping',
    accentColor: '#10B981'
  },
  {
    id: 4,
    isPro: false,
    initials: 'US',
    name: 'Usman Sheikh',
    team: 'Rawalpindi / Islamabad',
    role: 'Rank Grinder',
    badge: 'VERIFIED BUYER',
    badgeIcon: 'fa-circle-check',
    text: '"The 5-pack finger sleeves are incredible value. 10 individual sleeves that completely solve thumb sweat when playing in summer heat. Seamless glide on screen without touch delay. Fast delivery and excellent WhatsApp support."',
    gear: 'Esports Carbon Sleeves (Pack of 5 Pairs)',
    gearIcon: 'fa-bag-shopping',
    accentColor: '#10B981'
  },
  {
    id: 5,
    isPro: false,
    initials: 'BA',
    name: 'Bilal Ahmed',
    team: 'Peshawar, KPK',
    role: 'FPS Athlete',
    badge: 'VERIFIED BUYER',
    badgeIcon: 'fa-circle-check',
    text: '"Ordered HyperX Cloud 3 headset. Genuine Kingston hardware with serial verification. The spatial audio makes pinpointing enemy crouch-walks so much easier. ShopXzetio is my go-to gaming store now."',
    gear: 'HyperX Cloud III Gaming Headset',
    gearIcon: 'fa-bag-shopping',
    accentColor: '#10B981'
  },
  {
    id: 6,
    isPro: false,
    initials: 'ZK',
    name: 'Zaid Khan',
    team: 'Lahore, Punjab',
    role: 'iPad Competitor',
    badge: 'VERIFIED BUYER',
    badgeIcon: 'fa-circle-check',
    text: '"Fast delivery in Lahore within 24 hours. Ordered the PIVA G71 DAC splitter and it charges my iPad at 65W while giving ultra-clean audio output. Top-notch service from the ShopXzetio team!"',
    gear: 'PIVA G71 Ultra Soundcard Hub',
    gearIcon: 'fa-bag-shopping',
    accentColor: '#10B981'
  }
];

const ITEMS_PER_PAGE = 3;

export default function ReviewsSection() {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(REVIEWS_DATA.length / ITEMS_PER_PAGE);
  const currentReviews = REVIEWS_DATA.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        {/* Section Header with Controls */}
        <div className="reviews-top-bar">
          <div className="reviews-header-info">
            <div className="section-tag">COMMUNITY FEEDBACK</div>
            <h2 className="section-title">TESTED BY PROS & GAMERS</h2>
            <p className="section-desc">
              Authentic endorsements from Pakistan's top competitive athletes and tournament champions.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="reviews-nav-controls">
            <div className="reviews-page-indicator">
              <span>{currentPage + 1}</span> / <span>{totalPages}</span>
            </div>
            <button 
              onClick={handlePrev} 
              className="btn-review-arrow" 
              aria-label="Previous Reviews"
              title="Previous Reviews"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              onClick={handleNext} 
              className="btn-review-arrow" 
              aria-label="Next Reviews"
              title="Next Reviews"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* 3 Reviews Cards Grid */}
        <div className="reviews-carousel-grid">
          {currentReviews.map((item) => (
            <div 
              key={item.id} 
              className={`pro-review-card ${item.isPro ? 'is-pro-player' : ''}`}
            >
              {/* Background Quote Watermark */}
              <i className="fa-solid fa-quote-right pro-quote-watermark"></i>

              {/* Review Header */}
              <div className="pro-review-header">
                <div className="pro-author-meta">
                  <div 
                    className={`pro-avatar-badge ${item.isPro ? 'avatar-pro' : 'avatar-buyer'}`}
                  >
                    <span>{item.initials}</span>
                    {item.isPro && (
                      <span className="avatar-crown-indicator">
                        <i className="fa-solid fa-crown"></i>
                      </span>
                    )}
                  </div>

                  <div className="pro-author-details">
                    <div className="pro-name-row">
                      <h4 className="pro-author-name">{item.name}</h4>
                      <i className={`fa-solid fa-circle-check pro-tick-icon ${item.isPro ? 'tick-pro' : 'tick-buyer'}`}></i>
                    </div>
                    <div className="pro-team-role">
                      <span className="team-highlight">{item.team}</span>
                      <span className="role-sep">•</span>
                      <span className="role-text">{item.role}</span>
                    </div>
                  </div>
                </div>

                {/* Single-Line Pro / Buyer Pill */}
                <div className={`pro-status-pill ${item.isPro ? 'pill-pro' : 'pill-buyer'}`}>
                  <i className={`fa-solid ${item.badgeIcon}`}></i>
                  <span>{item.badge}</span>
                </div>
              </div>

              {/* Star Rating Row */}
              <div className="pro-stars-row">
                <div className="pro-stars-group">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <span className="pro-rating-score">5.0</span>
                <span className="pro-verified-label">• 100% Genuine Performance</span>
              </div>

              {/* Review Body */}
              <p className="pro-review-text">{item.text}</p>

              {/* Equipped Hardware Tag */}
              <div className="pro-equipped-tag">
                <i className={`fa-solid ${item.gearIcon}`}></i>
                <span>Equipped: <strong>{item.gear}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="reviews-dots-wrap">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`review-dot ${idx === currentPage ? 'active' : ''}`}
              aria-label={`Go to reviews page ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
