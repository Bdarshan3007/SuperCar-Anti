/* ==========================================================================
   COLLECTIONS PAGE
   Curated design series: Supercars, Hypercars, Grand Tourers, Track Machines,
   Electric Performance with interactive card hover transitions & image fallbacks
   ========================================================================== */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { COLLECTIONS } from '../data/collections';
import { useCars } from '../context/CarContext';
import ImageWithFallback from '../components/ImageWithFallback';
import ScrollReveal from '../components/ScrollReveal';

export default function Collections() {
  const navigate = useNavigate();
  const { setSelectedCategory } = useCars();

  const handleSelectCollection = (slug) => {
    setSelectedCategory(slug);
    navigate('/cars');
  };

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '7rem', backgroundColor: '#06070a', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <div style={{ marginBottom: '4rem' }}>
            <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
              <Sparkles size={14} style={{ color: 'var(--accent-red)' }} />
              <span>CATEGORICAL ARCHITECTURE</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800 }}>
              THE COLLECTIONS
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', color: 'var(--color-secondary)', maxWidth: '640px' }}>
              Distinct engineering manifestos divided by powertrain philosophy, downforce capability, and driving mission.
            </p>
          </div>
        </ScrollReveal>

        {/* Collections Stack Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {COLLECTIONS.map((col, index) => (
            <ScrollReveal key={col.id} variant={index % 2 === 0 ? "clip-up" : "fade-up"} delay={index * 0.1}>
              <div
                onClick={() => handleSelectCollection(col.slug)}
                data-cursor="explore"
                style={{
                  position: 'relative',
                  height: '380px',
                  backgroundColor: 'var(--bg-surface-card)',
                  border: '1px solid var(--color-hairline)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 'clamp(1.5rem, 4vw, 3rem)',
                  transition: 'border-color 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 56, 71, 0.7)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.6)';
                  const img = e.currentTarget.querySelector('.collection-bg-img');
                  if (img) img.style.transform = 'scale(1.05)';
                  const arrow = e.currentTarget.querySelector('.collection-arrow');
                  if (arrow) arrow.style.transform = 'translateX(6px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-hairline)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  const img = e.currentTarget.querySelector('.collection-bg-img');
                  if (img) img.style.transform = 'scale(1)';
                  const arrow = e.currentTarget.querySelector('.collection-arrow');
                  if (arrow) arrow.style.transform = 'translateX(0)';
                }}
              >
                {/* Background Image Container */}
                <div
                  className="collection-bg-img"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 0
                  }}
                >
                  <ImageWithFallback
                    src={col.image}
                    alt={col.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(65%) contrast(110%)'
                    }}
                  />
                </div>

                {/* Gradient Scrim */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(6, 7, 10, 0.95) 0%, rgba(6, 7, 10, 0.5) 45%, rgba(6, 7, 10, 0.15) 100%)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }} />

                {/* Content Overlay */}
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <span className="telemetry-badge" style={{ backgroundColor: 'rgba(255, 56, 71, 0.15)', borderColor: 'var(--accent-red)', color: '#fff' }}>
                      SERIES 0{index + 1} // {col.count}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                      BENCHMARK: {col.stat}
                    </span>
                  </div>

                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {col.title}
                  </h2>

                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-primary-dim)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    {col.description}
                  </p>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    color: 'var(--accent-red)'
                  }}>
                    <span>EXPLORE {col.title} FLEET</span>
                    <ArrowRight className="collection-arrow" size={16} style={{ transition: 'transform 0.3s ease' }} />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
