import React, { useRef, useState } from 'react';
import { useCart } from '../context/CartContext';

const REELS_DATA = [
  {
    key: 'crypto',
    src: '/assets/reels/CRYPTO.mp4',
    title: 'i8 Crypto Gear Review',
    tag: 'Team i8 Esports Pro',
    icon: 'fa-certificate'
  },
  {
    key: 'falak',
    src: '/assets/reels/FALAK.mp4',
    title: '4T Falak Audio Breakdown',
    tag: 'Team 4T Esports Pro',
    icon: 'fa-certificate'
  },
  {
    key: 'packaging',
    src: '/assets/reels/PACAKGING.mp4',
    title: 'Inside Our Packaging',
    tag: 'Safe Delivery Hub',
    icon: 'fa-box-open'
  },
  {
    key: 'why_gear',
    src: '/assets/reels/WHY GOOD EQIUPMENT.mp4',
    title: 'Why Good Gear Matters',
    tag: 'Competitive Advantage',
    icon: 'fa-chart-line'
  }
];

function ReelCard({ reel, onOpenModal }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="reel-card"
      onClick={() => onOpenModal(reel)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="reel-video-wrapper">
        <video 
          ref={videoRef}
          className="reel-video-preview" 
          preload="metadata" 
          muted 
          playsInline
        >
          <source src={reel.src} type="video/mp4" />
        </video>

        <div className="reel-play-indicator">
          <i className="fa-solid fa-play"></i>
        </div>

        <div className="reel-bottom-badge">
          <span className="reel-tag">
            <i className={`fa-solid ${reel.icon}`}></i> {reel.tag}
          </span>
          <span className="reel-title">{reel.title}</span>
        </div>
      </div>
    </div>
  );
}

export default function ReelsSection() {
  const [selectedReel, setSelectedReel] = useState(null);

  return (
    <section id="inside-shopxzetio" className="reels-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">PRO GAMER VERIFICATION</div>
          <h2 className="section-title">INSIDE SHOPXZETIO</h2>
          <p className="section-desc">
            Watch pro player breakdowns, packaging standards, and tournament hardware in action.
          </p>
        </div>

        <div className="reels-grid">
          {REELS_DATA.map((reel) => (
            <ReelCard 
              key={reel.key} 
              reel={reel} 
              onOpenModal={(r) => setSelectedReel(r)} 
            />
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedReel && (
        <div 
          className="modal-backdrop active" 
          onClick={(e) => { if (e.target.classList.contains('modal-backdrop')) setSelectedReel(null); }}
        >
          <div className="modal-content-cyber video-modal-content">
            <button 
              className="modal-close-btn" 
              onClick={() => setSelectedReel(null)} 
              aria-label="Close Video"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <video 
              className="video-modal-player" 
              controls 
              autoPlay 
              playsInline
            >
              <source src={selectedReel.src} type="video/mp4" />
              Your browser does not support video playback.
            </video>

            <div style={{ padding: '16px 20px', background: 'rgba(2, 7, 13, 0.95)', borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#fff' }}>
                {selectedReel.title}
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ShopXzetio Verified Media
                </span>
                <a 
                  href="#catalog" 
                  onClick={() => setSelectedReel(null)} 
                  style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--text-soft)' }}
                >
                  Equip Featured Gear &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
