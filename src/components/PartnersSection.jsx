import React from 'react';

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
              <img src="/assets/brand/PUBG.png" alt="PUBG Mobile Esports Official Partner" />
            </div>
            <div className="partner-content">
              <h3>PUBG MOBILE ESPORTS</h3>
              <div className="role">Official Partner</div>
              <p>
                Supporting official tournament circuits including PMGO South Asia and PMNC Pakistan championships with competitive tournament accessories.
              </p>
            </div>
          </div>

          {/* Card 2: Team i8 Esports */}
          <div className="partner-card">
            <div className="partner-logo-box">
              <img src="/assets/brand/ASI8.png" alt="Team i8 Esports Official Partner" />
            </div>
            <div className="partner-content">
              <h3>TEAM i8 ESPORTS</h3>
              <div className="role">Official Partner</div>
              <p>
                Equipping Pakistan's premier international esports roster with tournament-grade audio peripherals, cooling gear, and low-latency audio splitters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
