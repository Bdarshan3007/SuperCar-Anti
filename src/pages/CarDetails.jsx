/* ==========================================================================
   CAR DETAILS PAGE (UPGRADED MOTION & HIGH-RES MEDIA)
   Cinematic full-screen hero, deep specifications matrix, interactive acoustic rev,
   gallery plate viewer, radial performance gauges, and direct configurator link
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Flame, 
  Sliders, 
  Calendar, 
  Gauge, 
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useFavorites } from '../context/FavoriteContext';
import ImageWithFallback from '../components/ImageWithFallback';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import TestDriveModal from '../components/TestDriveModal';
import { soundEngine } from '../utils/soundEngine';
import { formatCurrency, formatSpeed, formatPower, formatTorque, formatAcceleration } from '../utils/formatters';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCarById } = useCars();
  const { isFavorite, toggleFavorite } = useFavorites();

  const car = getCarById(id);
  const favorited = car ? isFavorite(car.id) : false;

  const [activeMedia, setActiveMedia] = useState(car ? car.image : '');
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Synchronize active media state whenever route id changes to prevent stale media
  useEffect(() => {
    if (car) {
      setActiveMedia(car.image);
    }
  }, [car?.id, car?.image]);

  if (!car) {
    return (
      <div style={{ padding: '10rem 2rem', textAlign: 'center', backgroundColor: '#06070a', minHeight: '100vh' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>MACHINE NOT FOUND</h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-secondary)', marginBottom: '2rem' }}>
          Chassis specification &quot;{id}&quot; does not exist in the active fleet registry.
        </p>
        <Link to="/cars" className="btn-primary">RETURN TO SHOWROOM</Link>
      </div>
    );
  }

  const handleAudioRev = () => {
    soundEngine.startEngine(car.soundType || 'v8');
    soundEngine.revEngine(1.0);
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 1400);
  };

  return (
    <div style={{ backgroundColor: '#06070a', minHeight: '100vh' }}>
      
      {/* =========================================================================
          1. CINEMATIC DETAIL HERO
          ========================================================================= */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '5rem',
        paddingTop: '7rem',
        backgroundColor: '#06070a',
        overflow: 'hidden'
      }}>
        {/* Full-bleed Vehicle Image with Fade Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMedia || car.image}
            initial={{ opacity: 0.8, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${activeMedia || car.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(80%) contrast(110%)'
            }}
          />
        </AnimatePresence>

        {/* Ambient Dark Gradient Layer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(6,7,10,0.4) 0%, rgba(6,7,10,0.2) 40%, rgba(6,7,10,0.9) 85%, #06070a 100%)'
        }} />

        {/* Top Controls Overlay */}
        <div className="container" style={{ position: 'absolute', top: '6.5rem', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <button
            onClick={() => navigate('/cars')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(6, 7, 10, 0.75)',
              border: '1px solid var(--color-hairline)',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              padding: '0.5rem 0.85rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            <ArrowLeft size={16} />
            <span>BACK TO COLLECTION</span>
          </button>

          <button
            onClick={() => toggleFavorite(car.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(6, 7, 10, 0.75)',
              border: '1px solid var(--color-hairline)',
              color: favorited ? 'var(--accent-red)' : '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              padding: '0.5rem 0.85rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Heart size={16} fill={favorited ? 'var(--accent-red)' : 'none'} />
            <span>{favorited ? 'SAVED TO VAULT' : 'SAVE TO VAULT'}</span>
          </button>
        </div>

        {/* Hero Title & Identity */}
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '840px' }}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="telemetry-badge"
              style={{ marginBottom: '1rem' }}
            >
              <span className="telemetry-dot" />
              <span>{car.category} // {car.drive}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                lineHeight: 1.05,
                marginBottom: '1rem'
              }}
            >
              {car.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.125rem',
                color: 'var(--accent-red)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '1.5rem'
              }}
            >
              "{car.tagline}"
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                color: 'var(--color-primary-dim)',
                maxWidth: '680px',
                lineHeight: 1.6,
                marginBottom: '2.5rem'
              }}
            >
              {car.description}
            </motion.p>

            {/* Quick Actions Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}
            >
              <Link to={`/configurator/${car.id}`} className="btn-accent chamfer-btn">
                <Sliders size={16} />
                <span>CONFIGURE THIS VEHICLE</span>
              </Link>

              <button
                onClick={() => setTestDriveOpen(true)}
                className="btn-secondary"
              >
                <Calendar size={16} />
                <span>REQUEST TEST DRIVE</span>
              </button>

              <button
                onClick={handleAudioRev}
                className="btn-secondary"
                style={{ borderColor: isPlayingAudio ? 'var(--accent-red)' : 'var(--color-hairline)' }}
              >
                <Flame size={16} style={{ color: 'var(--accent-red)' }} />
                <span>{isPlayingAudio ? 'REV AT 8,500 RPM...' : 'LISTEN ENGINE REV'}</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PERFORMANCE DASHBOARD SECTION
          ========================================================================= */}
      <section style={{ padding: '6rem 0', backgroundColor: '#090b0f', borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container">
          
          <ScrollReveal effect="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
                <Gauge size={14} style={{ color: 'var(--accent-red)' }} />
                <span>MEASURED DYNAMICS // DYNO BENCHMARK</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800 }}>
                PERFORMANCE DASHBOARD
              </h2>
            </div>
          </ScrollReveal>

          {/* Large Numbers Matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {[
              { label: 'HORSEPOWER', val: car.horsepower, suffix: ' HP', desc: 'Bespoke high-rev output' },
              { label: 'PEAK TORQUE', val: car.torque, suffix: ' NM', desc: 'Instantaneous flat curve' },
              { label: '0 → 100 KM/H', val: car.acceleration, suffix: ' SEC', desc: 'Launch control deployment', decimals: 1 },
              { label: 'TOP VELOCITY', val: car.topSpeed, suffix: ' KM/H', desc: 'Aerodynamic top threshold' }
            ].map((stat, idx) => (
              <ScrollReveal key={stat.label} effect="fade-up" delay={idx * 0.1}>
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface-card)',
                    border: '1px solid var(--color-hairline)',
                    padding: '2rem',
                    borderTop: '3px solid var(--accent-red)'
                  }}
                >
                  <span className="label-caps" style={{ color: 'var(--color-muted)', display: 'block', marginBottom: '0.5rem' }}>
                    {stat.label}
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                    <AnimatedCounter value={stat.val} decimals={stat.decimals || 0} suffix={stat.suffix} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
                    {stat.desc}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Performance Capability Radial Indicators */}
          <ScrollReveal effect="scale-in">
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--color-hairline)',
              padding: '2.5rem'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>
                CHASSIS & DYNAMIC CAPABILITIES
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                {[
                  { name: 'POWER DELIVERY', pct: 95 },
                  { name: 'AERODYNAMIC DOWNFORCE', pct: 88 },
                  { name: 'HANDLING & LATERAL G', pct: 92 },
                  { name: 'ACCELERATION RESPONSE', pct: 96 }
                ].map((bar) => (
                  <div key={bar.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--color-secondary)' }}>{bar.name}</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{bar.pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                      <div style={{
                        width: `${bar.pct}%`,
                        height: '100%',
                        backgroundColor: 'var(--accent-red)',
                        boxShadow: '0 0 10px var(--accent-red)'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          3. FULL SPECIFICATIONS MATRIX
          ========================================================================= */}
      <section style={{ padding: '6rem 0', backgroundColor: '#06070a', borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container">
          
          <ScrollReveal effect="fade-up">
            <div style={{ marginBottom: '3rem' }}>
              <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
                <span>TECHNICAL BLUEPRINT</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>
                FULL SPECIFICATION MATRIX
              </h2>
            </div>
          </ScrollReveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1px',
            backgroundColor: 'var(--color-hairline)',
            border: '1px solid var(--color-hairline)'
          }}>
            {[
              { label: 'PROPULSION ARCHITECTURE', val: car.engine },
              { label: 'HORSEPOWER', val: formatPower(car.horsepower) },
              { label: 'TORQUE', val: formatTorque(car.torque) },
              { label: 'ACCELERATION 0-100 KM/H', val: formatAcceleration(car.acceleration) },
              { label: 'MAXIMUM VELOCITY', val: formatSpeed(car.topSpeed) },
              { label: 'TRANSMISSION', val: car.transmission },
              { label: 'DRIVE CONFIGURATION', val: car.drive },
              { label: 'CURB DRY MASS', val: car.weight },
              { label: 'POWER-TO-WEIGHT RATIO', val: car.powerToWeight || 'N/A' },
              { label: 'DOWNFORCE PROFILE', val: car.downforce || 'N/A' },
              { label: 'ESTIMATED BASE COMMISSION', val: formatCurrency(car.price) },
              { label: 'WARRANTY & CONCIERGE', val: '5-Year Atelier Care & Track Support' }
            ].map((spec) => (
              <div
                key={spec.label}
                style={{
                  backgroundColor: 'var(--bg-surface-low)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                <span className="label-caps" style={{ color: 'var(--color-muted)' }}>{spec.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: '#ffffff', fontWeight: 600 }}>
                  {spec.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PHOTOMETRIC PERSPECTIVES GALLERY
          ========================================================================= */}
      {car.gallery && car.gallery.length > 0 && (
        <section style={{ padding: '6rem 0', backgroundColor: '#090b0f', borderTop: '1px solid var(--color-hairline)' }}>
          <div className="container">
            
            <ScrollReveal effect="fade-up">
              <div style={{ marginBottom: '3rem' }}>
                <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
                  <span>HIGH FIDELITY ATELIER ARCHIVE</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>
                  PHOTOMETRIC PERSPECTIVES
                </h2>
              </div>
            </ScrollReveal>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {car.gallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveMedia(item.url)}
                  style={{
                    backgroundColor: 'var(--bg-surface-card)',
                    border: activeMedia === item.url ? '1px solid var(--accent-red)' : '1px solid var(--color-hairline)',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  className="gallery-item cursor-view-target"
                >
                  <div style={{ height: '220px', overflow: 'hidden' }}>
                    <ImageWithFallback
                      src={item.url}
                      alt={item.title}
                    />
                  </div>
                  <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ffffff' }}>
                      {item.title}
                    </span>
                    {activeMedia === item.url && (
                      <span className="telemetry-dot" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Test Drive Modal Integration */}
      <TestDriveModal
        isOpen={testDriveOpen}
        onClose={() => setTestDriveOpen(false)}
        defaultCarId={car.id}
      />
    </div>
  );
}
