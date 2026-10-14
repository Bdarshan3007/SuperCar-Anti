/* ==========================================================================
   LOADING SCREEN COMPONENT (AURA CINEMATIC CALIBRATION)
   Black screen -> AURA wordmark -> Laser line -> 00 -> 100% telemetry calibration
   ========================================================================== */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Fast, crisp cinematic loader: 1000ms
    const startTime = Date.now();
    const duration = 1000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsDone(true);
          if (onComplete) onComplete();
        }, 150);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#06070a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}
        >
          {/* Subtle Atmospheric Red Specular Center */}
          <div style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 56, 71, 0.12) 0%, transparent 65%)',
            pointerEvents: 'none'
          }} />

          {/* AURA Wordmark & Diamond Monogram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem' }}
          >
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--accent-red)',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 16px var(--accent-red)'
            }} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '0.3em',
              textTransform: 'uppercase'
            }}>
              AURA
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              color: 'var(--color-muted)',
              letterSpacing: '0.2em'
            }}>
              // MOTORWERKS
            </span>
          </motion.div>

          {/* Telemetry Status Line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.22em',
            color: 'var(--color-secondary)'
          }}>
            <span>ATELIER SYSTEM CALIBRATION</span>
            <span style={{ color: '#ffffff', fontWeight: 600, minWidth: '4ch', textAlign: 'right' }}>
              {progress.toString().padStart(2, '0')}%
            </span>
          </div>

          {/* Thin Laser Progress Track */}
          <div style={{
            width: '260px',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            marginTop: '1.25rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: 'var(--accent-red)',
              boxShadow: '0 0 10px var(--accent-red)',
              transition: 'width 0.05s linear'
            }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
