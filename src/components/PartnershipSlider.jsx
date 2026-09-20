import React from 'react';
import { ASSET_PATHS, handleImageError } from '../lib/assets';

const PARTNERS = [
  {
    logo: ASSET_PATHS.pubg,
    name: 'PUBG MOBILE',
    role: 'Official Partner',
    sub: 'GLOBAL ESPORTS'
  },
  {
    logo: ASSET_PATHS.pubg,
    name: 'PMGO SOUTH ASIA',
    role: 'Official Gear',
    sub: 'SOUTH ASIA FINALS'
  },
  {
    logo: ASSET_PATHS.teamI8,
    name: 'TEAM i8 ESPORTS',
    role: 'Pro Verified',
    sub: 'CHAMPIONS 2026'
  },
  {
    logo: ASSET_PATHS.pubg,
    name: 'PMNC PAKISTAN',
    role: 'Tournament Partner',
    sub: 'CHAMPIONSHIP 2026'
  }
];

export default function PartnershipSlider() {
  return (
    <section className="esports-broadcast-strip">
      <div className="container broadcast-container">
        {/* Centered micro-typography label */}
        <div className="broadcast-header-label">
          <span className="broadcast-subtext">OFFICIAL TOURNAMENT INFRASTRUCTURE & PARTNERS</span>
        </div>

        {/* Borderless, Reduced-Width Floating Logo Carousel */}
        <div className="broadcast-logos-row">
          {PARTNERS.map((partner, idx) => (
            <div key={idx} className="broadcast-partner-item">
              <img src={partner.logo} alt={partner.name} className="broadcast-logo-img" onError={handleImageError} />
              <div className="broadcast-partner-meta">
                <span className="broadcast-partner-name">{partner.name}</span>
                <span className="broadcast-partner-sub">{partner.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
