import React from 'react';
import { ASSET_PATHS, handleImageError } from '../lib/assets';

const PARTNERS = [
  {
    logo: ASSET_PATHS.teamI8,
    name: 'TEAM I8 ESPORTS',
    role: 'Pro Verified',
    sub: 'CHAMPIONS 2026',
    url: 'https://www.instagram.com/p/DXtxGDGiFPU/'
  },
  {
    logo: ASSET_PATHS.pubg,
    name: 'PMNC PAKISTAN',
    role: 'Tournament Partner',
    sub: 'CHAMPIONSHIP 2026',
    url: 'https://www.instagram.com/p/Dcf9PQWo0L2/'
  },
  {
    logo: ASSET_PATHS.pubg,
    name: 'PUBG MOBILE',
    role: 'Official Partner',
    sub: 'GLOBAL ESPORTS',
    url: 'https://www.instagram.com/p/DYJ2x4Skd10/'
  },
  {
    logo: ASSET_PATHS.pubg,
    name: 'PMGO SOUTH ASIA',
    role: 'Official Gear',
    sub: 'SOUTH ASIA FINALS',
    url: 'https://www.instagram.com/p/DYJ2x4Skd10/'
  }
];

export default function PartnershipSlider() {
  return (
    <section className="esports-broadcast-strip">
      <div className="container broadcast-container">
        {/* Centered micro-typography label with Click to Verify indicator */}
        <div className="broadcast-header-label">
          <span className="broadcast-subtext">OFFICIAL TOURNAMENT INFRASTRUCTURE & PARTNERS</span>
          <span className="broadcast-verified-pulse">
            <span className="pulse-dot" /> Click any partner to view proof ↗
          </span>
        </div>

        {/* Borderless, Infinite Scrolling Logo Carousel */}
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
              <a
                key={idx}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="broadcast-partner-item"
                title={`Click to view ${partner.name} on Instagram`}
              >
                <div className="broadcast-logo-wrap">
                  <img src={partner.logo} alt={partner.name} className="broadcast-logo-img" onError={handleImageError} />
                </div>
                <div className="broadcast-partner-meta">
                  <span className="broadcast-partner-name">{partner.name}</span>
                  <span className="broadcast-partner-sub">{partner.sub}</span>
                  <span className="broadcast-click-hint">
                    <i className="fa-brands fa-instagram" /> Click to see ↗
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
