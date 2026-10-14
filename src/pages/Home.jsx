/* ==========================================================================
   HOME PAGE (UPGRADED AURA DIGITAL SHOWROOM)
   Cinematic Staggered Hero, Line-by-Line Typography, 360° Drag Simulator,
   Scroll-Linked Storytelling, Radial Dyno Meters, Interactive Engineering Matrix
   ========================================================================== */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  Maximize2, 
  Gauge, 
  Zap, 
  Flame, 
  ShieldCheck, 
  ChevronRight,
  ChevronLeft,
  Sliders,
  Play,
  Pause,
  Info,
  Square,
  Crosshair
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import CarCard from '../components/CarCard';
import AnimatedCounter from '../components/AnimatedCounter';
import ScrollReveal from '../components/ScrollReveal';
import ImageWithFallback from '../components/ImageWithFallback';
import TestDriveModal from '../components/TestDriveModal';
import { COLLECTIONS } from '../data/collections';
import { JOURNAL_STORIES } from '../data/journal';
import { AURA_ASSETS } from '../data/assets';
import { soundEngine } from '../utils/soundEngine';
import { formatPower, formatSpeed, formatCurrency } from '../utils/formatters';

export default function Home() {
  const { cars } = useCars();
  const navigate = useNavigate();

  // Test Drive Modal
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const [selectedCarForDrive, setSelectedCarForDrive] = useState('valkyrie-vision');

  // Hero Parallax State (Desktop only)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Sound Engine
  const [isAudioRunning, setIsAudioRunning] = useState(false);
  const [revCount, setRevCount] = useState(0);

  // 360° Showroom State
  const [active360Index, setActive360Index] = useState(0);
  const [is360Dragging, setIs360Dragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [isAutoScanning, setIsAutoScanning] = useState(false);

  // Dyno Drive Mode
  const [dynoMode, setDynoMode] = useState('corsa'); // 'stealth', 'corsa', 'overboost'

  // Engineering Interactive Selection
  const [activeEngineeringIndex, setActiveEngineeringIndex] = useState(0);

  // Storytelling Active Step
  const [storyStep, setStoryStep] = useState(1);

  // Horizontal Fleet Showcase Track
  const fleetTrackRef = useRef(null);
  const [fleetScrollPct, setFleetScrollPct] = useState(0);
  const [activeCarIndex, setActiveCarIndex] = useState(0);

  const handleFleetScroll = () => {
    if (!fleetTrackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = fleetTrackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const pct = Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100));
      setFleetScrollPct(pct);
      const index = Math.min(cars.length - 1, Math.max(0, Math.round((scrollLeft / maxScroll) * (cars.length - 1))));
      setActiveCarIndex(index);
    }
  };

  const scrollFleet = (direction) => {
    if (!fleetTrackRef.current) return;
    const scrollAmount = fleetTrackRef.current.clientWidth * 0.75;
    fleetTrackRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  // Flagship Hero Car
  const heroCar = cars.find(c => c.id === 'valkyrie-vision') || cars[0];

  useEffect(() => {
    const unsub = soundEngine.subscribe((running) => {
      setIsAudioRunning(running);
    });
    return () => unsub();
  }, []);

  // Subtle Mouse Parallax Handler
  const handleHeroMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    // Capped to ±14px X and ±8px Y
    setMousePos({ x: x * 14, y: y * 8 });
  };

  const toggleSound = () => {
    if (isAudioRunning) {
      soundEngine.stopEngine();
    } else {
      soundEngine.startEngine(heroCar.soundType || 'v8');
    }
  };

  const handleRevEngine = () => {
    if (!isAudioRunning) {
      soundEngine.startEngine(heroCar.soundType || 'v8');
    }
    soundEngine.revEngine(1.0);
    setRevCount(prev => prev + 1);
  };

  // Multi-Azimuth Coherent Exterior Perspective Angles (Stitch Single Vehicle Renders)
  const angles = [
    AURA_ASSETS.valkyrieVision.front,
    AURA_ASSETS.valkyrieVision.hero,
    AURA_ASSETS.valkyrieVision.rear,
    AURA_ASSETS.valkyrieVision.rearAlt
  ];

  // Multi-Azimuth Perspective Metadata
  const PERSPECTIVES = [
    { label: 'FRONT 3/4 LATERAL', azimuth: '045°' },
    { label: 'FRONT GROUND-EFFECT', azimuth: '090°' },
    { label: 'REAR DIFFUSER BLADE', azimuth: '225°' },
    { label: 'HIGH-VELOCITY TAIL', azimuth: '270°' }
  ];

  // Preload authentic perspective frames to eliminate blank transitions
  useEffect(() => {
    angles.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-Scan interval cycling between calibrated azimuth perspectives
  useEffect(() => {
    if (!isAutoScanning) return;
    const interval = setInterval(() => {
      setActive360Index((prev) => (prev + 1) % angles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isAutoScanning, angles.length]);

  // Unified Pointer & Touch Drag Handlers
  const handlePointerDown = (e) => {
    setIs360Dragging(true);
    setDragStartX(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e) => {
    if (!is360Dragging) return;
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 30) {
      const step = diff > 0 ? 1 : -1;
      const nextIndex = (active360Index + step + angles.length) % angles.length;
      setActive360Index(nextIndex);
      setDragStartX(e.clientX);
    }
  };

  const handlePointerUp = (e) => {
    if (is360Dragging) {
      setIs360Dragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const scrollToNext = () => {
    const el = document.getElementById('fleet-showcase');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Engineering Data Matrix
  const engineeringItems = [
    {
      title: 'Carbon Fiber Monocoque',
      tag: 'STRUCTURAL MONOLITH',
      coords: '[X: 1042, Y: 388]',
      desc: 'Autoclaved prepreg carbon chassis offering 52,000 Nm/degree torsional stiffness with integrated FIA fuel cell safety cell.',
      image: AURA_ASSETS.engineering.monocoque
    },
    {
      title: 'Active Venturi Aerodynamics',
      tag: 'DOWNFORCE VECTORING',
      coords: '[X: 1420, Y: 620]',
      desc: 'Ground-effects underbody diffuser and active dual airbrakes generating 850 kg downforce at 250 km/h with a drag coefficient of 0.31.',
      image: AURA_ASSETS.valkyrieVision.hero
    },
    {
      title: 'Magnetorheological Dynamic Dampers',
      tag: '1,000 HZ RESPONSE',
      coords: '[X: 0620, Y: 410]',
      desc: 'Synthetic iron-particle suspension fluid recalculating vertical damping rate every 1 millisecond for telepathic tire contact.',
      image: AURA_ASSETS.engineering.suspension
    },
    {
      title: 'Carbon-Ceramic Rotors & 10-Piston Calipers',
      tag: 'THERMAL DECELERATION',
      coords: '[X: 0480, Y: 720]',
      desc: '420mm ventilated matrix discs capable of enduring 1,000°C track excursions without fade, stopping 100 to 0 km/h in 28.5 meters.',
      image: AURA_ASSETS.engineering.brakes
    },
    {
      title: '800V Silicon Carbide Inverter Hybrid',
      tag: 'TRANSIENT TORQUE FILL',
      coords: '[X: 0910, Y: 290]',
      desc: 'Twin axial flux electric motors providing 0 RPM immediate torque assist during turbocharger spool with 98.4% electrical efficiency.',
      image: AURA_ASSETS.valkyrieVision.powertrain
    }
  ];

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      
      {/* =========================================================================
          1. CINEMATIC STAGGERED HERO SECTION
          ========================================================================= */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: '5rem',
          paddingTop: '8rem',
          backgroundColor: '#06070a',
          overflow: 'hidden'
        }}
      >
        {/* Background Supercar Image with Depth Parallax and Slow Scale (1.08 -> 1) */}
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            inset: '-5%',
            backgroundImage: `url(${AURA_ASSETS.valkyrieVision.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 45%',
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'brightness(82%) contrast(110%)',
            pointerEvents: 'none'
          }}
        />

        {/* Ambient Dark Gradient & Radial Lighting Scrims */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(6,7,10,0.55) 0%, rgba(6,7,10,0.2) 35%, rgba(6,7,10,0.85) 80%, #06070a 100%)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 75% 35%, rgba(255, 56, 71, 0.14) 0%, transparent 60%)',
            pointerEvents: 'none'
          }}
        />

        {/* Floating Top Acoustic Sound Controller */}
        <div
          className="container"
          style={{
            position: 'absolute',
            top: '7rem',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="telemetry-badge"
          >
            <span className="telemetry-dot online animate-pulse-glow" />
            <span>SYS // ALLOCATION ATELIER ONLINE</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <button
              onClick={toggleSound}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                backgroundColor: isAudioRunning ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                border: '1px solid',
                borderColor: isAudioRunning ? 'var(--accent-red)' : 'var(--color-hairline)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                transition: 'all 0.25s'
              }}
            >
              {isAudioRunning ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{isAudioRunning ? 'ACOUSTIC RUN // ACTIVE' : 'ACOUSTIC IGNITION // OFF'}</span>
            </button>

            {isAudioRunning && (
              <button
                onClick={handleRevEngine}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid var(--color-hairline-bright)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  cursor: 'pointer'
                }}
              >
                <Flame size={14} style={{ color: 'var(--accent-red)' }} />
                <span>REV V8 (8,600 RPM)</span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Hero Central Content */}
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '880px' }}>
            
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-red)', transform: 'rotate(45deg)' }} />
              <span className="label-caps" style={{ color: 'var(--accent-red)' }}>
                THE ART OF PERFORMANCE
              </span>
            </motion.div>

            {/* Line-by-Line Staggered Main Headline */}
            <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 7.5vw, 6.2rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.95,
                  textTransform: 'uppercase'
                }}
              >
                BUILT
              </motion.div>

              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 7.5vw, 6.2rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.95,
                  textTransform: 'uppercase'
                }}
              >
                TO BE
              </motion.div>

              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, delay: 0.64, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 7.5vw, 6.2rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.95,
                  textTransform: 'uppercase'
                }}
              >
                <span className="text-gradient-red">REMEMBERED.</span>
              </motion.div>
            </div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.25rem',
                color: 'var(--color-primary-dim)',
                lineHeight: 1.5,
                maxWidth: '560px',
                marginBottom: '2.5rem'
              }}
            >
              Engineering without compromise. Autoclaved monocoque architecture, 1,180 horsepower, and aerodynamic dominance.
            </motion.p>

            {/* Sequenced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '3.5rem' }}
            >
              <Link to="/cars" className="btn-primary chamfer-btn">
                <span>EXPLORE COLLECTION</span>
                <ArrowRight size={16} />
              </Link>
              
              <Link to={`/cars/${heroCar.id}`} className="btn-secondary">
                <span>DISCOVER PERFORMANCE</span>
              </Link>
            </motion.div>
          </div>

          {/* Performance Specification Panel Sliding into Position */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              padding: '1.75rem 2rem',
              backgroundColor: 'rgba(12, 14, 19, 0.75)',
              backdropFilter: 'blur(24px)',
              border: '1px solid var(--color-hairline)',
              borderLeft: '3px solid var(--accent-red)'
            }}
          >
            <div>
              <span className="label-caps" style={{ display: 'block', marginBottom: '0.25rem' }}>ACCELERATION (0 → 100 KM/H)</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.25rem', fontWeight: 700, color: '#ffffff' }}>
                <AnimatedCounter value={2.1} decimals={1} suffix=" SEC" />
              </div>
            </div>

            <div>
              <span className="label-caps" style={{ display: 'block', marginBottom: '0.25rem' }}>TOP VELOCITY</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.25rem', fontWeight: 700, color: '#ffffff' }}>
                <AnimatedCounter value={405} decimals={0} suffix=" KM/H" />
              </div>
            </div>

            <div>
              <span className="label-caps" style={{ display: 'block', marginBottom: '0.25rem' }}>TOTAL POWER</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.25rem', fontWeight: 700, color: '#ffffff' }}>
                <AnimatedCounter value={1180} decimals={0} suffix=" HP" />
              </div>
            </div>

            <div>
              <span className="label-caps" style={{ display: 'block', marginBottom: '0.25rem' }}>DRY MONOCOQUE MASS</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.25rem', fontWeight: 700, color: '#ffffff' }}>
                <AnimatedCounter value={1320} decimals={0} suffix=" KG" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div
          onClick={scrollToNext}
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <span className="label-caps" style={{ fontSize: '0.625rem', color: 'var(--color-secondary)' }}>
            SCROLL TO EXPLORE
          </span>
          <div style={{
            width: '1px',
            height: '34px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div
              className="animate-scroll-line"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--accent-red)'
              }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FEATURED CARS ("THE MACHINES") + HORIZONTAL SHOWCASE
          ========================================================================= */}
      <section id="fleet-showcase" style={{ padding: '7rem 0', backgroundColor: '#090b0f', borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container">
          
          {/* Header */}
          <ScrollReveal effect="fade-up">
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '2rem',
              marginBottom: '3.5rem'
            }}>
              <div>
                <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
                  <span className="telemetry-dot" />
                  <span>FLEET SHOWROOM // ACTIVE SERIES</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, textTransform: 'uppercase' }}>
                  THE MACHINES
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', color: 'var(--color-secondary)', maxWidth: '540px' }}>
                  Designed for those who refuse ordinary. Each machine is an individual statement of mechanical purity and speed.
                </p>
              </div>

              {/* Navigation Controls + View Full Atelier Link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => scrollFleet('prev')}
                    className="btn-secondary"
                    style={{ padding: '0.65rem 0.85rem' }}
                    title="Previous vehicle"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => scrollFleet('next')}
                    className="btn-secondary"
                    style={{ padding: '0.65rem 0.85rem' }}
                    title="Next vehicle"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <Link to="/cars" className="btn-secondary">
                  <span>VIEW ALL ({cars.length})</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Horizontal Snap Track */}
          <div
            ref={fleetTrackRef}
            onScroll={handleFleetScroll}
            style={{
              display: 'flex',
              gap: '2rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: '2rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {cars.map((car, idx) => (
              <div
                key={car.id}
                style={{
                  width: 'clamp(280px, 32vw, 420px)',
                  minWidth: 'clamp(280px, 32vw, 420px)',
                  maxWidth: '440px',
                  flex: '0 0 auto',
                  scrollSnapAlign: 'start'
                }}
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>

          {/* Track Progress Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-hairline)'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
              MODEL 0{activeCarIndex + 1} OF 0{cars.length} // {cars[activeCarIndex]?.name.toUpperCase()}
            </div>

            <div style={{ width: '200px', height: '2px', backgroundColor: 'rgba(255,255,255,0.08)', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${Math.max(16, fleetScrollPct)}%`,
                  backgroundColor: 'var(--accent-red)',
                  transition: 'width 0.2s linear'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. 360° VIRTUAL SHOWROOM EXPERIENCE (ENHANCED DRAG & AZIMUTH)
          ========================================================================= */}
      <section style={{ padding: '7rem 0', backgroundColor: '#06070a', borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container">
          
          <ScrollReveal effect="fade-up">
            <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
              <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
                <RotateCw size={14} className={isAutoScanning ? "animate-spin" : ""} style={{ animationDuration: '6s', color: 'var(--accent-red)' }} />
                <span>CALIBRATED MULTI-AZIMUTH VIEWER // AERODYNAMIC TELEMETRY</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800 }}>
                INSPECT EXTERIOR CONTOURS
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-secondary)', lineHeight: 1.6 }}>
                Inspect authentic aerodynamic ground-effects, carbon monocoque venturi tunnels, and rear diffuser blades across 4 studio-calibrated azimuth perspective planes.
              </p>
            </div>
          </ScrollReveal>

          {/* Multi-Azimuth Interactive Canvas with Pointer & Keyboard Support */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            tabIndex={0}
            role="region"
            aria-label="Calibrated Multi-Azimuth Exterior Perspective Viewer. Use Left and Right Arrow keys or drag horizontally to change view."
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                setActive360Index((prev) => (prev + 1) % angles.length);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setActive360Index((prev) => (prev - 1 + angles.length) % angles.length);
              } else if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                setIsAutoScanning((prev) => !prev);
              }
            }}
            style={{
              position: 'relative',
              width: '100%',
              height: '560px',
              backgroundColor: 'var(--bg-surface-low)',
              border: '1px solid var(--color-hairline)',
              overflow: 'hidden',
              cursor: is360Dragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'pan-y'
            }}
            className="viewport-360 cursor-drag-target"
          >
            {/* Current Perspective Frame with Fallback Shimmer */}
            <ImageWithFallback
              src={angles[active360Index]}
              alt={`AURA Valkyrie Vision ${PERSPECTIVES[active360Index]?.label || 'Perspective'} Angle`}
              style={{
                width: '100%',
                height: '100%',
                filter: 'brightness(94%) contrast(106%)',
                pointerEvents: 'none'
              }}
            />

            {/* Coordinate Crosshairs & Active Telemetry HUD */}
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--color-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              backgroundColor: 'rgba(9, 10, 12, 0.85)',
              padding: '0.75rem 1rem',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--color-hairline)',
              borderLeft: '2px solid var(--accent-red)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="telemetry-dot" />
                <span style={{ color: '#fff', fontWeight: 600 }}>CHASSIS: AURA VALKYRIE VISION</span>
              </div>
              <span>FRAME: [0{active360Index + 1} / 0{angles.length}] &bull; AZIMUTH: {PERSPECTIVES[active360Index]?.azimuth || '000°'}</span>
              <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>PLANE: {PERSPECTIVES[active360Index]?.label}</span>
            </div>

            {/* Auto-Scan Status Badge (Top-Right) */}
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAutoScanning(prev => !prev);
                }}
                className="btn-secondary"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.6875rem',
                  backgroundColor: isAutoScanning ? 'rgba(255, 56, 71, 0.15)' : 'rgba(9, 10, 12, 0.85)',
                  borderColor: isAutoScanning ? 'var(--accent-red)' : 'var(--color-hairline)',
                  color: isAutoScanning ? 'var(--accent-red)' : '#ffffff',
                  backdropFilter: 'blur(12px)'
                }}
                title={isAutoScanning ? "Pause auto-scan rotation" : "Enable auto-scan rotation"}
              >
                {isAutoScanning ? <Pause size={13} style={{ marginRight: '0.35rem' }} /> : <Play size={13} style={{ marginRight: '0.35rem' }} />}
                <span>{isAutoScanning ? 'SCANNING AZIMUTH...' : 'AUTO-SCAN'}</span>
              </button>
            </div>

            {/* Bottom Controls Bar (Responsive & Accessible) */}
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(9, 10, 12, 0.92)',
              backdropFilter: 'blur(16px)',
              padding: '0.85rem 1.25rem',
              border: '1px solid var(--color-hairline)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <RotateCw size={16} style={{ color: 'var(--accent-red)' }} />
                <span className="label-caps" style={{ color: '#fff', fontSize: '0.6875rem' }}>
                  DRAG, USE ARROW KEYS, OR TAP PLANES
                </span>
              </div>

              {/* Angle Selector Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {angles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive360Index(idx);
                      setIsAutoScanning(false);
                    }}
                    aria-label={`Select ${PERSPECTIVES[idx]?.label} (Perspective 0${idx + 1}, Azimuth ${PERSPECTIVES[idx]?.azimuth})`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      background: active360Index === idx ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid',
                      borderColor: active360Index === idx ? 'var(--accent-red)' : 'var(--color-hairline)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>0{idx + 1}</span>
                    <span style={{ opacity: 0.7, fontSize: '0.625rem' }}>{PERSPECTIVES[idx]?.azimuth}</span>
                  </button>
                ))}
              </div>

              <Link
                to="/configurator/valkyrie-vision"
                className="chamfer-tag"
                style={{
                  textDecoration: 'none',
                  backgroundColor: 'var(--accent-red)',
                  color: '#ffffff',
                  padding: '0.45rem 1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  transition: 'background-color 0.2s'
                }}
              >
                CUSTOMIZE THIS SPEC
              </Link>
            </div>
          </div>

          {/* Technical Architecture Disclosure & Disclaimer Note */}
          <div style={{
            marginTop: '1.25rem',
            padding: '1rem 1.25rem',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--color-hairline)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}>
            <Info size={16} style={{ color: 'var(--accent-red)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
              <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>AURA AERODYNAMIC TELEMETRY ARCHITECTURE: </span>
              Displaying 4 studio-calibrated aerodynamic perspective views of the single Valkyrie Vision chassis (045° Bow, 090° Profile, 225° Quarter, 270° Stern). Continuous 12–24 frame rotational sequences require a dedicated 3D GLTF / WebGL asset pipeline to prevent generative AI geometry drift. Studio telemetry preserves genuine engineering fidelity without synthetic distortion.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PERFORMANCE & RADIAL DYNO DASHBOARD
          ========================================================================= */}
      <section style={{ padding: '7rem 0', backgroundColor: '#090b0f', borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            
            {/* Left: Dynamic Dyno Curve Chart */}
            <ScrollReveal effect="fade-up">
              <div>
                <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
                  <Gauge size={14} style={{ color: 'var(--accent-red)' }} />
                  <span>DYNAMIC DYNO BENCHMARK</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
                  TORQUE & HORSEPOWER CURVE
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-secondary)', marginBottom: '2rem' }}>
                  Live engine mapping illustrating 0 RPM electric flux torque handover into 8,500 RPM twin-turbo V8 peak output.
                </p>

                {/* Mode Selectors */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                  {[
                    { id: 'stealth', label: 'STEALTH EV (DUAL FLUX)' },
                    { id: 'corsa', label: 'CORSA HYBRID (OPTIMAL)' },
                    { id: 'overboost', label: 'OVERBOOST TRACK (BURST)' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setDynoMode(mode.id)}
                      style={{
                        flex: 1,
                        padding: '0.75rem 0.5rem',
                        backgroundColor: dynoMode === mode.id ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                        color: dynoMode === mode.id ? '#06070a' : 'var(--color-secondary)',
                        border: '1px solid',
                        borderColor: dynoMode === mode.id ? '#ffffff' : 'var(--color-hairline)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* SVG Curve Chart */}
                <div style={{
                  backgroundColor: 'var(--bg-surface-low)',
                  border: '1px solid var(--color-hairline)',
                  padding: '1.5rem',
                  position: 'relative'
                }}>
                  <svg viewBox="0 0 500 240" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    <line x1="0" y1="180" x2="500" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                    <path
                      d={
                        dynoMode === 'stealth'
                          ? 'M 0 210 Q 150 180 300 150 T 500 120'
                          : dynoMode === 'corsa'
                          ? 'M 0 210 Q 180 120 320 60 T 500 30'
                          : 'M 0 210 Q 180 90 320 40 T 500 15'
                      }
                      fill="none"
                      stroke="var(--accent-red)"
                      strokeWidth="3"
                      style={{ transition: 'all 0.5s ease-out' }}
                    />

                    <path
                      d={
                        dynoMode === 'stealth'
                          ? 'M 0 160 Q 150 150 300 160 T 500 180'
                          : dynoMode === 'corsa'
                          ? 'M 0 140 Q 160 50 300 65 T 500 85'
                          : 'M 0 130 Q 160 30 300 45 T 500 65'
                      }
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeDasharray="5 3"
                      style={{ transition: 'all 0.5s ease-out' }}
                    />
                  </svg>

                  <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '3px', backgroundColor: 'var(--accent-red)' }} />
                      <span style={{ color: '#fff' }}>HORSEPOWER (HP)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '2px', backgroundColor: '#fff', borderTop: '1px dashed #fff' }} />
                      <span style={{ color: 'var(--color-secondary)' }}>TORQUE (NM)</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Circular / Radial Dynamic Indicators */}
            <ScrollReveal effect="fade-up" delay={0.2}>
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--color-hairline)',
                padding: '2.5rem'
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>
                  AERODYNAMIC & CHASSIS GAUGE
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'POWER DENSITY', val: '894 HP/T', pct: 92 },
                    { label: 'AERO LOAD', val: '850 KG', pct: 88 },
                    { label: 'LATERAL GRIP', val: '1.85 G', pct: 95 },
                    { label: 'DECELERATION', val: '28.5 M', pct: 96 }
                  ].map((circle) => {
                    const radius = 38;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (circle.pct / 100) * circumference;

                    return (
                      <div key={circle.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <svg width="96" height="96" viewBox="0 0 96 96">
                          <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="4"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            fill="none"
                            stroke="var(--accent-red)"
                            strokeWidth="4"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform="rotate(-90 48 48)"
                            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
                          />
                          <text
                            x="48"
                            y="52"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontFamily="var(--font-mono)"
                            fontSize="12"
                            fontWeight="700"
                          >
                            {circle.val}
                          </text>
                        </svg>
                        <span className="label-caps" style={{ marginTop: '0.5rem', fontSize: '0.625rem' }}>
                          {circle.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setSelectedCarForDrive(heroCar.id);
                    setTestDriveOpen(true);
                  }}
                  className="btn-accent chamfer-btn"
                  style={{ width: '100%' }}
                >
                  REQUEST PROVING GROUND TEST DRIVE
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CINEMATIC SCROLL STORYTELLING (PHASED CONTINUOUS REVEAL)
          ========================================================================= */}
      <section style={{
        padding: '9rem 0',
        backgroundColor: '#06070a',
        borderTop: '1px solid var(--color-hairline)',
        position: 'relative'
      }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 4rem' }}>
            <div className="telemetry-badge" style={{ marginBottom: '1.25rem' }}>
              <span>AURA DESIGN MANIFESTO</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800 }}>
              SPEED IS ONLY <br />
              <span className="text-gradient">THE BEGINNING.</span>
            </h2>
          </div>

          {/* Continuous Phased Story Canvas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Visual Plate */}
            <ScrollReveal effect="scale-in">
              <div style={{
                position: 'relative',
                height: '440px',
                border: '1px solid var(--color-hairline)',
                overflow: 'hidden'
              }}>
                <ImageWithFallback
                  src={
                    storyStep === 1 
                      ? AURA_ASSETS.valkyrieVision.hero
                      : storyStep === 2 
                      ? AURA_ASSETS.valkyrieVision.rear
                      : AURA_ASSETS.valkyrieVision.powertrain
                  }
                  alt="AURA Manifesto Phase"
                  style={{ filter: 'brightness(85%) contrast(115%)' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(6,7,10,0.85) 0%, transparent 60%)'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--accent-red)'
                }}>
                  PHASE 0{storyStep} // AERODYNAMIC CONTINUITY
                </div>
              </div>
            </ScrollReveal>

            {/* Interactive Phased Statements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {[
                { step: 1, title: 'Every curve has a purpose.', desc: 'Body surfaces sculpted exclusively around low pressure vortices and downforce extraction.' },
                { step: 2, title: 'Every surface controls the air.', desc: 'Active laser blade taillights doubling as rear trailing-edge wake stall stabilizers.' },
                { step: 3, title: 'Nothing is accidental.', desc: 'High-modulus carbon composites baked under 7 bar autoclaved pressures for unyielding stiffness.' }
              ].map((item) => (
                <div
                  key={item.step}
                  onClick={() => setStoryStep(item.step)}
                  style={{
                    backgroundColor: storyStep === item.step ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-low)',
                    border: storyStep === item.step ? '1px solid var(--accent-red)' : '1px solid var(--color-hairline)',
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: storyStep === item.step ? 'translateX(8px)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: storyStep === item.step ? 'var(--accent-red)' : 'var(--color-muted)' }}>
                      0{item.step}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
                      "{item.title}"
                    </h3>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-secondary)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. INTERACTIVE ENGINEERING INTERFACE ("ENGINEERED WITHOUT COMPROMISE")
          ========================================================================= */}
      <section style={{ padding: '7rem 0', backgroundColor: '#090b0f', borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container">
          
          <ScrollReveal effect="fade-up">
            <div style={{ marginBottom: '3.5rem' }}>
              <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
                <ShieldCheck size={14} style={{ color: 'var(--accent-red)' }} />
                <span>AEROSPACE GRADE ENGINEERING</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800 }}>
                ENGINEERED WITHOUT COMPROMISE
              </h2>
            </div>
          </ScrollReveal>

          {/* Split Screen Technical Interface */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left: Technical Selection List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {engineeringItems.map((item, idx) => (
                <div
                  key={item.title}
                  onClick={() => setActiveEngineeringIndex(idx)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    backgroundColor: activeEngineeringIndex === idx ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-low)',
                    border: activeEngineeringIndex === idx ? '1px solid var(--accent-red)' : '1px solid var(--color-hairline)',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className="label-caps" style={{ color: activeEngineeringIndex === idx ? 'var(--accent-red)' : 'var(--color-muted)' }}>
                      {item.tag}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                      {item.coords}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Right: Component Zoom Visualizer & Coordinate Tag */}
            <div style={{
              position: 'relative',
              height: '420px',
              backgroundColor: 'var(--bg-surface-low)',
              border: '1px solid var(--color-hairline)',
              overflow: 'hidden'
            }}>
              <ImageWithFallback
                src={engineeringItems[activeEngineeringIndex].image}
                alt={engineeringItems[activeEngineeringIndex].title}
                style={{
                  width: '100%',
                  height: '100%',
                  filter: 'brightness(90%) contrast(110%)'
                }}
              />

              {/* Coordinate Reticle Ping */}
              <div style={{
                position: 'absolute',
                top: '25%',
                right: '25%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(6,7,10,0.85)',
                padding: '0.35rem 0.65rem',
                border: '1px solid var(--accent-red)',
                backdropFilter: 'blur(8px)'
              }}>
                <Crosshair size={14} style={{ color: 'var(--accent-red)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#fff' }}>
                  {engineeringItems[activeEngineeringIndex].coords}
                </span>
              </div>

              {/* Bottom Description Overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1.5rem',
                backgroundColor: 'rgba(6, 7, 10, 0.92)',
                borderTop: '1px solid var(--color-hairline)',
                backdropFilter: 'blur(16px)'
              }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                  {engineeringItems[activeEngineeringIndex].title}
                </h4>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-secondary)', lineHeight: 1.5 }}>
                  {engineeringItems[activeEngineeringIndex].desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. SOUND EXPERIENCE ("HEAR THE MACHINE")
          ========================================================================= */}
      <section style={{ padding: '7rem 0', backgroundColor: '#06070a', borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container">
          
          <ScrollReveal effect="scale-in">
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--color-hairline)',
              padding: '4rem 3rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
                <Volume2 size={14} style={{ color: 'var(--accent-red)' }} />
                <span>ACOUSTIC HARMONICS // WEB AUDIO SYNTHESIS</span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1rem' }}>
                HEAR THE MACHINE
              </h2>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', color: 'var(--color-secondary)', maxWidth: '600px', marginBottom: '2.5rem' }}>
                Procedural Web Audio API sound synthesis simulating low-frequency crankshaft idle and an ear-splitting 8,600 RPM throttle surge.
              </p>

              {/* Dynamic Waveform Visualizer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                height: '60px',
                width: '100%',
                maxWidth: '360px',
                marginBottom: '2.5rem'
              }}>
                {[1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6].map((bar, i) => (
                  <div
                    key={i}
                    className={isAudioRunning ? `wave-bar-${(i % 6) + 1}` : ''}
                    style={{
                      width: '5px',
                      height: isAudioRunning ? '70%' : '15%',
                      backgroundColor: isAudioRunning ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.15)',
                      boxShadow: isAudioRunning ? '0 0 10px var(--accent-red)' : 'none',
                      transition: 'height 0.2s, background-color 0.2s'
                    }}
                  />
                ))}
              </div>

              {/* Control Triggers */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', zIndex: 10 }}>
                <button
                  onClick={toggleSound}
                  className={isAudioRunning ? 'btn-accent' : 'btn-primary'}
                  style={{ minWidth: '220px' }}
                >
                  {isAudioRunning ? <Square size={16} /> : <Play size={16} />}
                  <span>{isAudioRunning ? 'STOP ENGINE' : 'START ENGINE'}</span>
                </button>

                {isAudioRunning && (
                  <button
                    onClick={handleRevEngine}
                    className="btn-secondary"
                  >
                    <Flame size={16} style={{ color: 'var(--accent-red)' }} />
                    <span>REV ENGINE ({revCount})</span>
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          8. EDITORIAL JOURNAL PREVIEW
          ========================================================================= */}
      <section style={{ padding: '7rem 0', backgroundColor: '#090b0f', borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container">
          
          <ScrollReveal effect="fade-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
              <div>
                <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
                  <span>MOTORWERKS ATELIER ARCHIVE</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800 }}>
                  THE JOURNAL
                </h2>
              </div>
              <Link to="/journal" className="btn-secondary">
                <span>EXPLORE ALL STORIES</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {JOURNAL_STORIES.slice(0, 3).map((story, idx) => (
              <ScrollReveal key={story.id} effect="fade-up" delay={idx * 0.1}>
                <div
                  onClick={() => navigate('/journal')}
                  style={{
                    backgroundColor: 'var(--bg-surface-card)',
                    border: '1px solid var(--color-hairline)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  className="cursor-view-target"
                >
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <ImageWithFallback
                      src={story.image}
                      alt={story.title}
                    />
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                      <span>{story.category}</span>
                      <span>{story.date}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                      {story.title}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-secondary)', lineHeight: 1.5, marginBottom: '1.5rem', marginTop: 'auto' }}>
                      {story.excerpt}
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>
                      <span>READ STORY</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Test Drive Modal Integration */}
      <TestDriveModal
        isOpen={testDriveOpen}
        onClose={() => setTestDriveOpen(false)}
        defaultCarId={selectedCarForDrive}
      />
    </div>
  );
}
