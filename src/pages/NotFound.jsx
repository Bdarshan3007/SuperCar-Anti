/* ==========================================================================
   404 NOT FOUND PAGE
   Branded Kinetic Obsidian 404 error view with telemetry status and recovery CTA
   ========================================================================== */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      paddingTop: '9rem',
      paddingBottom: '8rem',
      backgroundColor: '#06070a',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Atmospheric Red Specular Background Accent */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '560px',
        height: '560px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 56, 71, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ maxWidth: '640px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--color-hairline)',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
            position: 'relative'
          }}
        >
          {/* Top Status Header */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <div className="telemetry-badge" style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}>
              <span className="telemetry-dot" style={{ backgroundColor: 'var(--accent-red)' }} />
              <span>TELEMETRY DISCONNECTED // 404</span>
            </div>
          </div>

          {/* Large Monospace 404 Indicator */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(4rem, 12vw, 6.5rem)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            marginBottom: '0.75rem',
            textShadow: '0 0 30px rgba(255, 56, 71, 0.25)'
          }}>
            404
          </div>

          {/* Primary Error Heading */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            TRAJECTORY UNRESOLVED
          </h1>

          {/* Descriptive Body */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--color-secondary)',
            lineHeight: 1.6,
            maxWidth: '480px',
            margin: '0 auto 2.5rem'
          }}>
            The requested telemetry coordinate or atelier route does not exist in the active system registry. The chassis may have been relocated or decommissioned.
          </p>

          {/* Actions */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <Link
              to="/cars"
              className="btn-accent chamfer-btn"
              style={{ padding: '0.85rem 1.75rem' }}
            >
              <span>RETURN TO COLLECTION</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/"
              className="btn-secondary"
              style={{ padding: '0.85rem 1.5rem' }}
            >
              <ArrowLeft size={16} />
              <span>ATELIER HOME</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
