import React from 'react';
import { ASSET_PATHS, handleImageError } from '../lib/assets';

export default function PartnersSection() {
  return (
    <section id="partners" className="partners-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">OFFICIAL PARTNERS</div>
          <h2 className="section-title">ESPORTS PARTNERSHIPS</h2>
          <p className="section-desc">
            Backing the biggest competitive circuits and championship teams across Pakistan and South Asia.
          </p>
        </div>

        <div className="partners-grid">
          {/* Card 1: PUBG Mobile Esports */}
          <div className="partner-card">
            <div className="partner-logo-box">
              <img src={ASSET_PATHS.pubg} alt="PUBG Mobile Esports Official Partner" onError={handleImageError} />
            </div>
            <div className="partner-content">
              <h3>PUBG MOBILE ESPORTS</h3>
              <div className="role">Official Partner</div>
              <p>
                Supporting official tournament circuits including PMGO South Asia and PMNC Pakistan championships with competitive tournament accessories.
              </p>
              <div className="partner-links" style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                <a
                  href="https://www.instagram.com/p/DYJ2x4Skd10/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-ig-pill"
                >
                  <i className="fa-brands fa-instagram" /> PMGO South Asia
                </a>
                <a
                  href="https://www.instagram.com/p/Dcf9PQWo0L2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-ig-pill"
                >
                  <i className="fa-brands fa-instagram" /> PMNC Pakistan
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Team i8 Esports */}
          <div className="partner-card">
            <div className="partner-logo-box">
              <img src={ASSET_PATHS.teamI8} alt="Team i8 Esports Official Partner" onError={handleImageError} />
            </div>
            <div className="partner-content">
              <h3>TEAM i8 ESPORTS</h3>
              <div className="role">Official Partner</div>
              <p>
                Equipping Pakistan's premier international esports roster with tournament-grade audio peripherals, cooling gear, and low-latency audio splitters.
              </p>
              <div className="partner-links" style={{ marginTop: 14 }}>
                <a
                  href="https://www.instagram.com/p/DXtxGDGiFPU/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-ig-pill"
                >
                  <i className="fa-brands fa-instagram" /> Team i8 Esports Announcement
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
