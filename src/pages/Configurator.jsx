/* ==========================================================================
   CONFIGURATOR PAGE (UPGRADED MOTION & CONSISTENCY)
   Smooth crossfade, specular paint shader overlay, animated price interpolation,
   interior preview toggle, and LocalStorage persistence
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Bookmark, Calendar, ArrowRight, RotateCcw, Eye, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCars } from '../context/CarContext';
import { CONFIGURATOR_OPTIONS } from '../data/cars';
import { AURA_ASSETS } from '../data/assets';
import ImageWithFallback from '../components/ImageWithFallback';
import AnimatedCounter from '../components/AnimatedCounter';
import { storage } from '../utils/storage';
import { formatCurrency } from '../utils/formatters';
import TestDriveModal from '../components/TestDriveModal';

export default function Configurator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars } = useCars();

  // Find if a valid car matches route param
  const matchingCar = id ? cars.find(c => c.id === id) : null;
  const isInvalidParam = Boolean(id && !matchingCar);

  const [selectedCarId, setSelectedCarId] = useState(() => {
    if (matchingCar) return matchingCar.id;
    return 'valkyrie-vision';
  });

  // Keep selectedCarId in sync with route param changes
  useEffect(() => {
    if (id && cars.some(c => c.id === id)) {
      setSelectedCarId(id);
    }
  }, [id, cars]);

  const activeCar = cars.find(c => c.id === selectedCarId) || cars[0];

  // Perspective View: 'exterior' or 'interior'
  const [viewPerspective, setViewPerspective] = useState('exterior');

  // Configuration Choices
  const [selectedColor, setSelectedColor] = useState(CONFIGURATOR_OPTIONS.colors[0]);
  const [selectedWheel, setSelectedWheel] = useState(CONFIGURATOR_OPTIONS.wheels[0]);
  const [selectedInterior, setSelectedInterior] = useState(CONFIGURATOR_OPTIONS.interior[0]);
  const [selectedPackage, setSelectedPackage] = useState(CONFIGURATOR_OPTIONS.packages[0]);

  // Saved Notification State
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testDriveOpen, setTestDriveOpen] = useState(false);

  // Price Calculation
  const basePrice = activeCar.price;
  const optionsPrice = (selectedColor.price || 0) + 
                       (selectedWheel.price || 0) + 
                       (selectedInterior.price || 0) + 
                       (selectedPackage.price || 0);
  const totalPrice = basePrice + optionsPrice;

  const handleSave = () => {
    storage.saveConfiguration({
      carId: activeCar.id,
      carName: activeCar.name,
      basePrice,
      optionsPrice,
      totalPrice,
      color: selectedColor,
      wheel: selectedWheel,
      interior: selectedInterior,
      package: selectedPackage,
      carImage: activeCar.image
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ff3847', '#ffffff', '#8e939c']
      });
    } catch {
      // ignore
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setSelectedColor(CONFIGURATOR_OPTIONS.colors[0]);
    setSelectedWheel(CONFIGURATOR_OPTIONS.wheels[0]);
    setSelectedInterior(CONFIGURATOR_OPTIONS.interior[0]);
    setSelectedPackage(CONFIGURATOR_OPTIONS.packages[0]);
  };

  // Determine current image based on perspective
  const currentRender = viewPerspective === 'interior'
    ? (activeCar.gallery?.find(g => g.id === 'interior' || g.id === 'cockpit')?.url || activeCar.image)
    : activeCar.image;

  return (
    <div style={{ paddingTop: '7.5rem', paddingBottom: '7rem', backgroundColor: '#06070a', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div>
            <div className="telemetry-badge" style={{ marginBottom: '0.75rem' }}>
              <span className="telemetry-dot" />
              <span>BESPOKE ATELIER COMMISSION // 2026 SPEC</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800 }}>
              CREATE YOUR MACHINE
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-secondary)' }}>
              Configure chassis finish, forged wheels, interior ergonomics, and aerodynamic track packages.
            </p>
          </div>

          {/* Model Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="label-caps" style={{ color: 'var(--color-muted)' }}>SELECT MODEL:</span>
            <select
              value={selectedCarId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedCarId(newId);
                navigate(`/configurator/${newId}`, { replace: true });
              }}
              className="input-dark"
              style={{ width: 'auto', padding: '0.65rem 1.25rem', cursor: 'pointer' }}
            >
              {cars.map((c) => (
                <option key={c.id} value={c.id} style={{ backgroundColor: '#111318', color: '#fff' }}>
                  {c.name} ({formatCurrency(c.price)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Graceful Fallback Notice for Unrecognized Specification IDs */}
        {isInvalidParam && (
          <div style={{
            backgroundColor: 'rgba(255, 56, 71, 0.08)',
            border: '1px solid var(--accent-red)',
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={18} style={{ color: 'var(--accent-red)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#fff' }}>
                SPECIFICATION ID &quot;{id}&quot; NOT FOUND IN FLEET REGISTRY. DISPLAYING VALKYRIE VISION ATELIER SPEC.
              </span>
            </div>
            <Link to="/cars" className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.6875rem' }}>
              VIEW ALL MODELS
            </Link>
          </div>
        )}

        {/* Studio Viewport & Configurator HUD */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '3rem',
          alignItems: 'start'
        }}>
          
          {/* Left: Visual Studio Canvas (Sticky) */}
          <div style={{ position: 'sticky', top: '6.5rem' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '480px',
              backgroundColor: 'var(--bg-surface-low)',
              border: '1px solid var(--color-hairline)',
              overflow: 'hidden'
            }}>
              {/* Animated Vehicle Crossfade Render */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCar.id}-${viewPerspective}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <ImageWithFallback
                    src={currentRender}
                    alt={activeCar.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      filter: 'brightness(94%) contrast(108%)'
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Dynamic Metallic Specular Color Tint Overlay (Exterior only) */}
              {viewPerspective === 'exterior' && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: selectedColor.tint,
                    mixBlendMode: 'color',
                    pointerEvents: 'none',
                    transition: 'background-color 0.4s ease'
                  }}
                />
              )}

              {/* Perspective Toggle: Exterior vs Interior */}
              <div style={{
                position: 'absolute',
                top: '1.25rem',
                left: '1.25rem',
                display: 'flex',
                gap: '0.4rem',
                zIndex: 10
              }}>
                <button
                  onClick={() => setViewPerspective('exterior')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    backgroundColor: viewPerspective === 'exterior' ? 'var(--accent-red)' : 'rgba(6, 7, 10, 0.85)',
                    color: '#ffffff',
                    border: '1px solid',
                    borderColor: viewPerspective === 'exterior' ? 'var(--accent-red)' : 'var(--color-hairline)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  EXTERIOR STANCE
                </button>

                <button
                  onClick={() => setViewPerspective('interior')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    backgroundColor: viewPerspective === 'interior' ? 'var(--accent-red)' : 'rgba(6, 7, 10, 0.85)',
                    color: '#ffffff',
                    border: '1px solid',
                    borderColor: viewPerspective === 'interior' ? 'var(--accent-red)' : 'var(--color-hairline)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  DRIVER COCKPIT
                </button>
              </div>

              {/* Active Config Bottom Pill */}
              <div style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                right: '1.25rem',
                backgroundColor: 'rgba(6, 7, 10, 0.92)',
                border: '1px solid var(--color-hairline)',
                padding: '0.75rem 1.25rem',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem'
              }}>
                <span style={{ color: 'var(--color-secondary)' }}>
                  {selectedColor.name} // {selectedWheel.name}
                </span>
                <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
                  <AnimatedCounter value={totalPrice} prefix="$" />
                </span>
              </div>
            </div>

            {/* Reset Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <button
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={12} />
                <span>RESTORE ATELIER BASELINE</span>
              </button>

              <span className="label-caps" style={{ color: 'var(--color-muted)' }}>
                POWERTRAIN: {activeCar.horsepower} HP // {activeCar.engine}
              </span>
            </div>
          </div>

          {/* Right: Customization Controls Panel */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--color-hairline)',
            padding: '2.5rem'
          }}>
            
            {/* 1. Exterior Color Swatches */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="label-caps">1. EXTERIOR FINISH</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fff' }}>
                  {selectedColor.name} {selectedColor.price > 0 && `(+${formatCurrency(selectedColor.price)})`}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {CONFIGURATOR_OPTIONS.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setSelectedColor(color);
                      setViewPerspective('exterior');
                    }}
                    style={{
                      width: '42px',
                      height: '42px',
                      backgroundColor: color.hex,
                      border: selectedColor.id === color.id ? '2px solid var(--accent-red)' : '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: selectedColor.id === color.id ? '0 0 12px var(--accent-red-glow)' : 'none',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    title={color.name}
                  >
                    {selectedColor.id === color.id && (
                      <Check size={16} style={{ color: color.id === 'glacier' ? '#000' : '#fff' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Forged Wheels */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="label-caps">2. WHEELS & ROTOR CLEARANCE</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fff' }}>
                  {selectedWheel.name} {selectedWheel.price > 0 && `(+${formatCurrency(selectedWheel.price)})`}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {CONFIGURATOR_OPTIONS.wheels.map((wheel) => (
                  <button
                    key={wheel.id}
                    onClick={() => setSelectedWheel(wheel)}
                    style={{
                      padding: '1rem',
                      backgroundColor: selectedWheel.id === wheel.id ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-low)',
                      border: selectedWheel.id === wheel.id ? '1px solid var(--accent-red)' : '1px solid var(--color-hairline)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {wheel.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-secondary)' }}>
                      {wheel.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Interior Upholstery */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="label-caps">3. BESPOKE INTERIOR ATELIER</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fff' }}>
                  {selectedInterior.name} {selectedInterior.price > 0 && `(+${formatCurrency(selectedInterior.price)})`}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {CONFIGURATOR_OPTIONS.interior.map((interior) => (
                  <button
                    key={interior.id}
                    onClick={() => {
                      setSelectedInterior(interior);
                      setViewPerspective('interior');
                    }}
                    style={{
                      padding: '1rem',
                      backgroundColor: selectedInterior.id === interior.id ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-low)',
                      border: selectedInterior.id === interior.id ? '1px solid var(--accent-red)' : '1px solid var(--color-hairline)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {interior.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-secondary)' }}>
                      {interior.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Aerodynamic Track Package */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="label-caps">4. AERODYNAMIC & DYNAMIC PACK</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#fff' }}>
                  {selectedPackage.name} {selectedPackage.price > 0 && `(+${formatCurrency(selectedPackage.price)})`}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {CONFIGURATOR_OPTIONS.packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    style={{
                      padding: '1rem',
                      backgroundColor: selectedPackage.id === pkg.id ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-low)',
                      border: selectedPackage.id === pkg.id ? '1px solid var(--accent-red)' : '1px solid var(--color-hairline)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {pkg.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
                        {pkg.desc}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: pkg.price === 0 ? 'var(--color-muted)' : 'var(--accent-red)', fontWeight: 600 }}>
                      {pkg.price === 0 ? 'INCLUDED' : `+${formatCurrency(pkg.price)}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown Matrix with Dynamic Interpolation */}
            <div style={{
              backgroundColor: 'var(--bg-surface-low)',
              border: '1px solid var(--color-hairline)',
              padding: '1.75rem',
              marginBottom: '2rem'
            }}>
              <div className="label-caps" style={{ color: '#fff', marginBottom: '1rem' }}>
                YOUR CONFIGURATION SUMMARY
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', borderBottom: '1px solid var(--color-hairline)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-secondary)' }}>
                  <span>BASE COMMISSION ({activeCar.name}):</span>
                  <span style={{ color: '#fff' }}>{formatCurrency(basePrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-secondary)' }}>
                  <span>SELECTED ATELIER OPTIONS:</span>
                  <span style={{ color: '#fff' }}>+{formatCurrency(optionsPrice)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="label-caps" style={{ color: '#fff', fontSize: '0.75rem' }}>TOTAL COMMISSION:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.625rem', fontWeight: 800, color: 'var(--accent-red)' }}>
                  <AnimatedCounter value={totalPrice} prefix="$" />
                </span>
              </div>
            </div>

            {/* Actions: Save to LocalStorage / Test Drive */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={handleSave}
                className="btn-accent chamfer-btn"
                style={{ width: '100%', padding: '1rem' }}
              >
                <Bookmark size={16} />
                <span>{saveSuccess ? 'COMMISSION SAVED TO VAULT!' : 'SAVE CONFIGURATION'}</span>
              </button>

              <button
                onClick={() => setTestDriveOpen(true)}
                className="btn-secondary"
                style={{ width: '100%', padding: '0.875rem' }}
              >
                <Calendar size={16} />
                <span>DISPATCH BUILD SPEC TO CONCIERGE</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Test Drive Modal Integration */}
      <TestDriveModal
        isOpen={testDriveOpen}
        onClose={() => setTestDriveOpen(false)}
        defaultCarId={activeCar.id}
      />
    </div>
  );
}
