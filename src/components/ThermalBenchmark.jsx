import React, { useState } from 'react';

export default function ThermalBenchmark() {
  const [activeMode, setActiveMode] = useState('with-cooler'); // 'no-cooler' | 'with-cooler'

  return (
    <section className="thermal-benchmark-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">LIVE PERFORMANCE TELEMETRY</div>
          <h2 className="section-title">WHY CRYO COOLING MATTERS IN TOURNAMENTS</h2>
          <p className="section-desc">
            Real laboratory & scrim telemetry recorded during 30 minutes of high-tier competitive PUBG Mobile scrims.
          </p>
        </div>

        <div className="benchmark-interactive-box">
          {/* Mode Switcher Buttons */}
          <div className="benchmark-mode-toggle">
            <button
              onClick={() => setActiveMode('no-cooler')}
              className={`mode-btn ${activeMode === 'no-cooler' ? 'active-throttled' : ''}`}
            >
              <i className="fa-solid fa-fire-flame-curved"></i> WITHOUT CRYO COOLER (Stock Device)
            </button>
            <button
              onClick={() => setActiveMode('with-cooler')}
              className={`mode-btn ${activeMode === 'with-cooler' ? 'active-cryo' : ''}`}
            >
              <i className="fa-solid fa-snowflake"></i> WITH PIVA B2 CRYO COOLER (ShopXzetio)
            </button>
          </div>

          {/* Telemetry Display Grid */}
          <div className="benchmark-display-grid">
            {/* Metric 1: FPS Stability */}
            <div className={`benchmark-stat-card ${activeMode === 'with-cooler' ? 'stat-pro' : 'stat-bad'}`}>
              <div className="stat-card-header">
                <span className="stat-label">AVERAGE FRAME RATE (FPS)</span>
                <i className={`fa-solid ${activeMode === 'with-cooler' ? 'fa-chart-line-up' : 'fa-chart-line-down'}`}></i>
              </div>
              <div className="stat-big-value">
                {activeMode === 'with-cooler' ? '120.0 FPS' : '58.4 FPS'}
              </div>
              <div className="stat-progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: activeMode === 'with-cooler' ? '100%' : '48%',
                    background: activeMode === 'with-cooler' ? 'linear-gradient(90deg, #06B6D4, #10B981)' : '#EF4444'
                  }}
                />
              </div>
              <p className="stat-summary">
                {activeMode === 'with-cooler' 
                  ? '🔒 Locked 120 FPS rock-solid during intense 5v5 smoke & vehicle fights.'
                  : '❌ Severe 50% frame drops due to thermal throttling after 12 minutes.'}
              </p>
            </div>

            {/* Metric 2: Device Temperature */}
            <div className={`benchmark-stat-card ${activeMode === 'with-cooler' ? 'stat-pro' : 'stat-bad'}`}>
              <div className="stat-card-header">
                <span className="stat-label">CHIPSET / SURFACE TEMP</span>
                <i className={`fa-solid ${activeMode === 'with-cooler' ? 'fa-snowflake' : 'fa-fire'}`}></i>
              </div>
              <div className="stat-big-value">
                {activeMode === 'with-cooler' ? '18.5°C' : '47.8°C'}
              </div>
              <div className="stat-progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: activeMode === 'with-cooler' ? '30%' : '95%',
                    background: activeMode === 'with-cooler' ? 'linear-gradient(90deg, #8B5CF6, #06B6D4)' : '#EF4444'
                  }}
                />
              </div>
              <p className="stat-summary">
                {activeMode === 'with-cooler' 
                  ? '❄️ 20W semiconductor active heat extraction keeps phone ice-cold.'
                  : '🔥 Overheating causes aggressive CPU clock down, gyro lag, and battery drain.'}
              </p>
            </div>

            {/* Metric 3: Touch & Screen Delay */}
            <div className={`benchmark-stat-card ${activeMode === 'with-cooler' ? 'stat-pro' : 'stat-bad'}`}>
              <div className="stat-card-header">
                <span className="stat-label">TOUCH RESPONSE LATENCY</span>
                <i className="fa-solid fa-hand-pointer"></i>
              </div>
              <div className="stat-big-value">
                {activeMode === 'with-cooler' ? '1.2 ms' : '14.8 ms'}
              </div>
              <div className="stat-progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: activeMode === 'with-cooler' ? '15%' : '85%',
                    background: activeMode === 'with-cooler' ? 'linear-gradient(90deg, #06B6D4, #3B82F6)' : '#EF4444'
                  }}
                />
              </div>
              <p className="stat-summary">
                {activeMode === 'with-cooler' 
                  ? '⚡ Instant flick-shots and 0ms gyro tracking response with silver sleeves.'
                  : '⚠️ Sweaty screen friction and touch polling drops lose crucial 1v1 fights.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
