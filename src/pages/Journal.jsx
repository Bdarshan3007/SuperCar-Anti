/* ==========================================================================
   JOURNAL / EDITORIAL PAGE
   Design studio essays, powertrain deep-dives, and technical analysis
   with animated reader modal, reading progress bar, and ImageWithFallback
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Clock, Calendar, BookOpen, Share2 } from 'lucide-react';
import { JOURNAL_STORIES } from '../data/journal';
import ImageWithFallback from '../components/ImageWithFallback';
import ScrollReveal from '../components/ScrollReveal';

export default function Journal() {
  const [selectedStory, setSelectedStory] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track modal scroll progress for the reading bar
  const handleModalScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedStory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setScrollProgress(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedStory]);

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '7rem', backgroundColor: '#06070a', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <div style={{ marginBottom: '4rem', maxWidth: '780px' }}>
            <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
              <span>MOTORWERKS ATELIER ARCHIVE</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800 }}>
              THE JOURNAL
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', color: 'var(--color-secondary)' }}>
              Essays on aerodynamic theory, 800V silicon carbide propulsion, carbon composite metallurgy, and high-strung acoustic harmonics.
            </p>
          </div>
        </ScrollReveal>

        {/* Stories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          {JOURNAL_STORIES.map((story, idx) => (
            <ScrollReveal key={story.id} variant="fade-up" delay={idx * 0.1}>
              <article
                onClick={() => setSelectedStory(story)}
                data-cursor="view"
                style={{
                  backgroundColor: 'var(--bg-surface-card)',
                  border: '1px solid var(--color-hairline)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'border-color 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 56, 71, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.5)';
                  const img = e.currentTarget.querySelector('.journal-img-thumb');
                  if (img) img.style.transform = 'scale(1.05)';
                  const arrow = e.currentTarget.querySelector('.journal-arrow');
                  if (arrow) arrow.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-hairline)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  const img = e.currentTarget.querySelector('.journal-img-thumb');
                  if (img) img.style.transform = 'scale(1)';
                  const arrow = e.currentTarget.querySelector('.journal-arrow');
                  if (arrow) arrow.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ height: '240px', overflow: 'hidden' }}>
                  <div className="journal-img-thumb" style={{ width: '100%', height: '100%', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <ImageWithFallback
                      src={story.image}
                      alt={story.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>

                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                    <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>{story.category}</span>
                    <span>{story.readTime}</span>
                  </div>

                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.3 }}>
                    {story.title}
                  </h2>

                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-secondary)', lineHeight: 1.6, marginBottom: '2rem', marginTop: 'auto' }}>
                    {story.excerpt}
                  </p>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    color: '#ffffff'
                  }}>
                    <span>READ STORY</span>
                    <ArrowRight className="journal-arrow" size={14} style={{ color: 'var(--accent-red)', transition: 'transform 0.3s ease' }} />
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Full Article Reader Modal with Reading Progress */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedStory(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99995,
              backgroundColor: 'rgba(6, 7, 10, 0.94)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(1rem, 3vw, 2.5rem)'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              onScroll={handleModalScroll}
              style={{
                width: '100%',
                maxWidth: '780px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--color-hairline)',
                maxHeight: '88vh',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)'
              }}
            >
              {/* Reading Progress Line */}
              <div style={{
                position: 'sticky',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                zIndex: 20
              }}>
                <div style={{
                  height: '100%',
                  width: `${scrollProgress}%`,
                  backgroundColor: 'var(--accent-red)',
                  transition: 'width 0.1s linear'
                }} />
              </div>

              {/* Header Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem 2rem',
                borderBottom: '1px solid var(--color-hairline)',
                position: 'sticky',
                top: '3px',
                backgroundColor: 'rgba(11, 13, 18, 0.95)',
                backdropFilter: 'blur(16px)',
                zIndex: 10
              }}>
                <span className="label-caps">{selectedStory.category} // ARCHIVE DISPATCH</span>
                <button
                  onClick={() => setSelectedStory(null)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--color-hairline)',
                    color: '#fff',
                    cursor: 'pointer',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-red)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Story Content */}
              <div style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
                <div style={{ width: '100%', height: '340px', marginBottom: '2rem', overflow: 'hidden' }}>
                  <ImageWithFallback
                    src={selectedStory.image}
                    alt={selectedStory.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
                  <span>PUBLISHED: {selectedStory.date}</span>
                  <span>DURATION: {selectedStory.readTime}</span>
                </div>

                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  {selectedStory.title}
                </h1>

                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  color: 'var(--color-primary-dim)',
                  lineHeight: 1.8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  <p style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 500, lineHeight: 1.6, borderLeft: '2px solid var(--accent-red)', paddingLeft: '1.25rem' }}>
                    {selectedStory.excerpt}
                  </p>
                  <p>
                    {selectedStory.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
