import React from 'react';

const PARTNERS = [
  {
    logo: '/assets/brand/PUBG.png',
    name: 'PUBG MOBILE',
    role: 'Official Partner',
    sub: 'GLOBAL ESPORTS'
  },
  {
    logo: '/assets/brand/PUBG.png',
    name: 'PMGO SOUTH ASIA',
    role: 'Official Gear',
    sub: 'SOUTH ASIA FINALS'
  },
  {
    logo: '/assets/brand/ASI8.png',
    name: 'TEAM i8 ESPORTS',
    role: 'Pro Verified',
    sub: 'CHAMPIONS 2026'
  },
  {
    logo: '/assets/brand/PUBG.png',
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
              <img src={partner.logo} alt={partner.name} className="broadcast-logo-img" />
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
