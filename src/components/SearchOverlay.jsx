/* ==========================================================================
   SEARCH OVERLAY COMPONENT
   Full-screen dynamic search and instant filtering with keyboard ESC support
   ========================================================================== */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Zap, Gauge, Flame } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { formatCurrency, formatSpeed, formatPower } from '../utils/formatters';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { cars } = useCars();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = query.trim() === '' ? [] : cars.filter(c => {
    const q = query.toLowerCase();
    return c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.engine.toLowerCase().includes(q) ||
      c.horsepower.toString().includes(q) ||
      c.features.some(f => f.toLowerCase().includes(q));
  });

  const handleSelectCar = (carId) => {
    onClose();
    navigate(`/cars/${carId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99990,
            backgroundColor: 'rgba(6, 7, 10, 0.95)',
            backdropFilter: 'blur(30px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2rem 3rem',
            borderBottom: '1px solid var(--color-hairline)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-red)', transform: 'rotate(45deg)' }} />
              <span className="label-caps">FLEET TELEMETRY SEARCH // INDEX ACTIVE</span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: '1px solid var(--color-hairline)',
                color: '#fff',
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em'
              }}
            >
              <X size={16} />
              <span>[ESC] CLOSE</span>
            </button>
          </div>

          {/* Main Search Body */}
          <div className="container" style={{ flex: 1, overflowY: 'auto', paddingTop: '3rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '840px', margin: '0 auto' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                color: 'var(--accent-red)',
                marginBottom: '1rem'
              }}>
                QUERY THE ATELIER
              </div>

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '2rem'
              }}>
                SEARCH THE COLLECTION
              </h2>

              {/* Input Box */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '2px solid var(--color-hairline-bright)',
                marginBottom: '2rem',
                transition: 'border-color 0.2s'
              }}>
                <Search size={28} style={{ color: 'var(--color-secondary)', marginRight: '1rem' }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter model, V8/V12, horsepower, or category..."
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    padding: '1rem 0'
                  }}
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Quick Suggestion Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '3rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-muted)', alignSelf: 'center' }}>
                  QUICK FILTERS:
                </span>
                {['Hypercar', 'V8 Twin Turbo', '1000+ HP', 'V12', 'Electric', 'AWD'].map((pill) => (
                  <button
                    key={pill}
                    onClick={() => setQuery(pill)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--color-hairline)',
                      color: 'var(--color-primary-dim)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      padding: '0.35rem 0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {pill}
                  </button>
                ))}
              </div>

              {/* Dynamic Results List */}
              {query.trim() !== '' && (
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-secondary)',
                    marginBottom: '1.25rem',
                    letterSpacing: '0.14em'
                  }}>
                    MATCHES FOUND: {searchResults.length}
                  </div>

                  {searchResults.length === 0 ? (
                    <div style={{
                      padding: '3rem',
                      border: '1px dashed var(--color-hairline)',
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-muted)'
                    }}>
                      NO VEHICLES MATCHING "{query.toUpperCase()}". TRY SEARCHING BY HP OR ENGINE TYPE.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {searchResults.map((car) => (
                        <div
                          key={car.id}
                          onClick={() => handleSelectCar(car.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1.25rem 1.5rem',
                            backgroundColor: 'var(--bg-surface-low)',
                            border: '1px solid var(--color-hairline)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-red)';
                            e.currentTarget.style.backgroundColor = 'var(--bg-surface-card)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-hairline)';
                            e.currentTarget.style.backgroundColor = 'var(--bg-surface-low)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <img
                              src={car.image}
                              alt={car.name}
                              style={{ width: '90px', height: '60px', objectFit: 'cover', border: '1px solid var(--color-hairline)' }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
                                  {car.name}
                                </h4>
                                <span className="telemetry-badge" style={{ padding: '0.15rem 0.5rem', fontSize: '0.625rem' }}>
                                  {car.category}
                                </span>
                              </div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
                                {car.engine} // {formatPower(car.horsepower)} // {formatSpeed(car.topSpeed)}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                                {formatCurrency(car.price)}
                              </div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-red)' }}>
                                0-100: {car.acceleration}s
                              </div>
                            </div>
                            <ArrowRight size={18} style={{ color: 'var(--accent-red)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
