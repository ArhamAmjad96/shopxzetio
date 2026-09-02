import React from 'react';
import { useCart } from '../context/CartContext';
import PRODUCTS from '../data/products';

export default function ProLoadouts() {
  const { addToCart, openDetail } = useCart();

  // 4T Falak Loadout Products
  const falakCooler = PRODUCTS.find(p => p.id === 'piva-b2') || PRODUCTS[0];
  const falakHeadset = PRODUCTS.find(p => p.id === 'hyperx-cloud-2-red') || PRODUCTS[6];
  const falakSplitter = PRODUCTS.find(p => p.id === 'piva-gs1-pro') || PRODUCTS[12];
  const falakSleeves = PRODUCTS.find(p => p.id === 'carbon-sleeves-5pair') || PRODUCTS[18];

  // i8 Crypto Loadout Products
  const cryptoCooler = PRODUCTS.find(p => p.id === 'x30-radiator') || PRODUCTS[1];
  const cryptoSoundcard = PRODUCTS.find(p => p.id === 'piva-g71') || PRODUCTS[13];
  const cryptoHeadset = PRODUCTS.find(p => p.id === 'hyperx-cloud-alpha-s') || PRODUCTS[7];

  const handleEquipFalakBundle = () => {
    addToCart(falakCooler);
    addToCart(falakHeadset);
    addToCart(falakSplitter);
    addToCart(falakSleeves);
  };

  const handleEquipCryptoBundle = () => {
    addToCart(cryptoCooler);
    addToCart(cryptoSoundcard);
    addToCart(cryptoHeadset);
  };

  return (
    <section className="pro-loadouts-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">CHAMPION CALIBRATION</div>
          <h2 className="section-title">PRO ATHLETE TOURNAMENT LOADOUTS</h2>
          <p className="section-desc">
            Exact tournament hardware setups used by Pakistan's PUBG Mobile champions in official competitive circuits.
          </p>
        </div>

        <div className="pro-loadouts-grid">
          {/* Card 1: 4T Falak Champion Loadout */}
          <div className="pro-loadout-card loadout-falak">
            <div className="loadout-badge-top">
              <span className="loadout-athlete-tag"><i className="fa-solid fa-crown"></i> 4T FALAK OFFICIAL SETUP</span>
              <span className="loadout-discount-tag">SAVE RS. 1,000 BUNDLE</span>
            </div>

            <div className="loadout-header-info">
              <div className="loadout-avatar">4T</div>
              <div>
                <h3 className="loadout-athlete-name">4T Falak Tournament Loadout</h3>
                <span className="loadout-team-meta">Team 4T Esports • PUBG Mobile Champion</span>
              </div>
            </div>

            <p className="loadout-quote">
              "The combination of PIVA B2 Cryo cooling and HyperX spatial acoustics guarantees 120 FPS frame stability and instant footstep cues."
            </p>

            <div className="loadout-gear-list">
              <div className="gear-item" onClick={() => openDetail(falakCooler)}>
                <img src={falakCooler.images[0]} alt={falakCooler.name} />
                <div>
                  <span className="gear-category">Cryo Cooler</span>
                  <h4>{falakCooler.name}</h4>
                  <span className="gear-price">Rs. {falakCooler.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="gear-item" onClick={() => openDetail(falakHeadset)}>
                <img src={falakHeadset.images[0]} alt={falakHeadset.name} />
                <div>
                  <span className="gear-category">Tournament Audio</span>
                  <h4>{falakHeadset.name}</h4>
                  <span className="gear-price">Rs. {falakHeadset.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="gear-item" onClick={() => openDetail(falakSplitter)}>
                <img src={falakSplitter.images[0]} alt={falakSplitter.name} />
                <div>
                  <span className="gear-category">60W Fast Splitter</span>
                  <h4>{falakSplitter.name}</h4>
                  <span className="gear-price">Rs. {falakSplitter.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button 
              className="btn-equip-loadout btn-falak-glow"
              onClick={handleEquipFalakBundle}
            >
              <i className="fa-solid fa-bolt"></i> EQUIP 4T FALAK LOADOUT (4 ITEMS)
            </button>
          </div>

          {/* Card 2: i8 Crypto Pro Loadout */}
          <div className="pro-loadout-card loadout-crypto">
            <div className="loadout-badge-top">
              <span className="loadout-athlete-tag"><i className="fa-solid fa-trophy"></i> i8 CRYPTO OFFICIAL SETUP</span>
              <span className="loadout-discount-tag">SAVE RS. 1,000 BUNDLE</span>
            </div>

            <div className="loadout-header-info">
              <div className="loadout-avatar avatar-crypto">CR</div>
              <div>
                <h3 className="loadout-athlete-name">i8 Crypto Tournament Loadout</h3>
                <span className="loadout-team-meta">Team i8 Esports • Tier-1 Competitive Athlete</span>
              </div>
            </div>

            <p className="loadout-quote">
              "Continuous 6-match tournament days require heavy 65W charging without thermal throttling. The PIVA G71 DSP hub delivers perfection."
            </p>

            <div className="loadout-gear-list">
              <div className="gear-item" onClick={() => openDetail(cryptoSoundcard)}>
                <img src={cryptoSoundcard.images[0]} alt={cryptoSoundcard.name} />
                <div>
                  <span className="gear-category">32-Bit Soundcard</span>
                  <h4>{cryptoSoundcard.name}</h4>
                  <span className="gear-price">Rs. {cryptoSoundcard.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="gear-item" onClick={() => openDetail(cryptoHeadset)}>
                <img src={cryptoHeadset.images[0]} alt={cryptoHeadset.name} />
                <div>
                  <span className="gear-category">Dual Chamber Headset</span>
                  <h4>{cryptoHeadset.name}</h4>
                  <span className="gear-price">Rs. {cryptoHeadset.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="gear-item" onClick={() => openDetail(cryptoCooler)}>
                <img src={cryptoCooler.images[0]} alt={cryptoCooler.name} />
                <div>
                  <span className="gear-category">Dual Engine Cooler</span>
                  <h4>{cryptoCooler.name}</h4>
                  <span className="gear-price">Rs. {cryptoCooler.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button 
              className="btn-equip-loadout btn-crypto-glow"
              onClick={handleEquipCryptoBundle}
            >
              <i className="fa-solid fa-bolt"></i> EQUIP i8 CRYPTO LOADOUT (3 ITEMS)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
