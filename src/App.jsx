import React, { useEffect } from 'react';
import { useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PartnershipSlider from './components/PartnershipSlider';
import TrustBar from './components/TrustBar';
import HomeStorefront from './components/HomeStorefront';
import CategoryPage from './components/CategoryPage';
import ReelsSection from './components/ReelsSection';
import ReviewsSection from './components/ReviewsSection';
import PartnersSection from './components/PartnersSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import AdminDashboard from './components/AdminDashboard';
import LightPillar from './components/LightPillar';
import ProLoadouts from './components/ProLoadouts';
import ThermalBenchmark from './components/ThermalBenchmark';
import DeviceCompatibilityModal from './components/DeviceCompatibilityModal';
import OrderTrackerModal from './components/OrderTrackerModal';

export default function App() {
  const { currentView, toast } = useCart();
  const [compatModalOpen, setCompatModalOpen] = React.useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = React.useState(false);

  // Expose global modal triggers for Navbar/Footer buttons
  useEffect(() => {
    window.openCompatModal = () => setCompatModalOpen(true);
    window.openTrackerModal = () => setTrackerModalOpen(true);
    return () => {
      delete window.openCompatModal;
      delete window.openTrackerModal;
    };
  }, []);

  // Auto-route /admin or #admin on mount
  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.search.includes('view=admin') || window.location.pathname === '/admin') {
      setCurrentView('admin');
    }
  }, [setCurrentView]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="app-container">
      {/* Global High-Performance Volumetric WebGL Light Pillar Backdrop */}
      <div className="global-site-bg-wrapper">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={0.85}
          rotationSpeed={0.25}
          glowAmount={0.0022}
          pillarWidth={3.2}
          pillarHeight={0.35}
          noiseIntensity={0.4}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
        <div className="global-site-vignette" />
      </div>

      {/* Render Admin Dashboard when currentView is admin */}
      {currentView === 'admin' ? (
        <AdminDashboard />
      ) : (
        <>
          {/* Toast Notification */}
      {toast && (
        <div className="cyber-toast">
          <i className="fa-solid fa-circle-check" style={{ color: '#10B981' }}></i>
          <span>{toast}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar 
        onOpenCompat={() => setCompatModalOpen(true)}
        onOpenTracker={() => setTrackerModalOpen(true)}
      />

      <main>
        {/* Render appropriate view based on current route */}
        {(!currentView || currentView === 'home' || currentView === 'store') && (
          <>
            <Hero onOpenCompat={() => setCompatModalOpen(true)} />
            <PartnershipSlider />
            <TrustBar />
            <HomeStorefront />
            <ProLoadouts />
            <ThermalBenchmark />
            <ReelsSection />
            <ReviewsSection />
            <PartnersSection />
          </>
        )}

        {currentView === 'coolers' && (
          <CategoryPage 
            categoryKey="coolers" 
            title="Mobile Phone Coolers" 
            subtitle="Peltier semiconductor chillers and 20W rapid cooling radiators engineered to stop FPS drops."
            icon="fa-snowflake"
          />
        )}

        {currentView === 'audio' && (
          <CategoryPage 
            categoryKey="audio" 
            title="Gaming Headsets & Audio" 
            subtitle="Hi-Res dual-chamber acoustic drivers engineered for pinpoint 360° footsteps in competitive PUBG Mobile."
            icon="fa-headphones"
          />
        )}

        {currentView === 'splitters' && (
          <CategoryPage 
            categoryKey="splitters" 
            title="60W DAC Fast Charge Splitters" 
            subtitle="Simultaneous ultra-fast charging + 0ms 32-bit lossless DAC audio soundcards."
            icon="fa-bolt"
          />
        )}

        {currentView === 'accessories' && (
          <CategoryPage 
            categoryKey="accessories" 
            title="Esports Sleeves & Accessories" 
            subtitle="Sweat-proof silver fiber finger sleeves and high-velocity tournament table fans."
            icon="fa-gamepad"
          />
        )}

        {currentView === 'arsenal' && (
          <CategoryPage 
            categoryKey="all" 
            title="Complete Tournament Arsenal" 
            subtitle="Explore our full 22-piece catalog of authentic esports hardware and gaming gear."
            icon="fa-boxes-stacked"
          />
        )}
      </main>

      {/* Professional Footer */}
      <Footer />

      {/* Slide-overs & Modals */}
      <CartDrawer />
      <ProductDetailModal />
      <CheckoutModal />
      <OrderSuccessModal />
      <DeviceCompatibilityModal isOpen={compatModalOpen} onClose={() => setCompatModalOpen(false)} />
      <OrderTrackerModal isOpen={trackerModalOpen} onClose={() => setTrackerModalOpen(false)} />

      {/* Floating WhatsApp Action */}
      <a 
        href="https://wa.me/923348590229?text=Hello%20ShopXzetio!%20I%20have%20an%20inquiry%20regarding%20gaming%20gear." 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-floating-btn"
        aria-label="Direct WhatsApp Contact"
      >
        <i className="fa-brands fa-whatsapp"></i>
        <span className="tooltip">Chat with Support</span>
      </a>
      </>
      )}
    </div>
  );
}
