/* ==========================================================================
   FAVORITES PAGE (SAVED VAULT)
   Display saved hypercars from LocalStorage with instant removal and compare link
   ========================================================================== */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCars } from '../context/CarContext';
import { useFavorites } from '../context/FavoriteContext';
import CarCard from '../components/CarCard';
import ScrollReveal from '../components/ScrollReveal';

export default function Favorites() {
  const { cars } = useCars();
  const { favorites, removeFavorite } = useFavorites();

  const favoriteCars = cars.filter(c => favorites.includes(c.id));

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '7rem', backgroundColor: '#06070a', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <div style={{ marginBottom: '3.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}>
            <div>
              <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
                <Heart size={14} fill="var(--accent-red)" style={{ color: 'var(--accent-red)' }} />
                <span>COLLECTOR VAULT // LOCAL ARCHIVE</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800 }}>
                YOUR SAVED MACHINES
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', color: 'var(--color-secondary)' }}>
                {favoriteCars.length} hypercars bookmarked in your private browser archive.
              </p>
            </div>

            {favoriteCars.length > 1 && (
              <Link to="/compare" className="btn-secondary">
                <span>COMPARE SAVED FLEET</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </ScrollReveal>

        {favoriteCars.length === 0 ? (
          <ScrollReveal variant="fade-up">
            <div style={{
              padding: '6rem 2rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px dashed var(--color-hairline)'
            }}>
              <Heart size={48} style={{ color: 'var(--color-muted)', margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
                YOUR VAULT IS CURRENTLY EMPTY
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-secondary)', maxWidth: '480px', margin: '0 auto 2rem' }}>
                Click the heart icon on any vehicle card in the showroom to save vehicles to your personal evaluation list.
              </p>
              <Link to="/cars" className="btn-primary">
                EXPLORE THE FLEET
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '2.5rem'
          }}>
            <AnimatePresence>
              {favoriteCars.map((car) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <CarCard car={car} />

                  {/* Dedicated Non-Overlapping Action Toolbar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--color-hairline)',
                    borderTop: 'none',
                    marginTop: '0'
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: 'var(--color-muted)',
                      letterSpacing: '0.08em'
                    }}>
                      SAVED SPECIFICATION
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(car.id);
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid transparent',
                        color: 'var(--color-muted)',
                        padding: '0.35rem 0.65rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        letterSpacing: '0.08em',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--accent-red)';
                        e.currentTarget.style.borderColor = 'rgba(255, 56, 71, 0.3)';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 56, 71, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-muted)';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Remove from favorites"
                      aria-label={`Remove ${car.name} from saved favorites`}
                    >
                      <Trash2 size={13} />
                      <span>REMOVE FROM ARCHIVE</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
