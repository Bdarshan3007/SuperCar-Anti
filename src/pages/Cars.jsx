/* ==========================================================================
   CARS SHOWROOM / FLEET CATALOG PAGE
   Multi-axis filtering, instant search, sorting, animated grid layout
   ========================================================================== */

import React, { useState } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, ListFilter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCars } from '../context/CarContext';
import CarCard from '../components/CarCard';
import ScrollReveal from '../components/ScrollReveal';

export default function Cars() {
  const { 
    filteredCars, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    sortBy,
    setSortBy
  } = useCars();

  const categories = ['ALL', 'Supercar', 'Hypercar', 'Grand Tourer', 'Track Machine', 'Electric Performance'];

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '7rem', minHeight: '100vh', backgroundColor: '#06070a' }}>
      <div className="container">
        
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <div style={{ marginBottom: '3.5rem' }}>
            <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
              <span>FLEET CATALOG // COMMISSIONS</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, textTransform: 'uppercase' }}>
              THE COLLECTION
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', color: 'var(--color-secondary)', maxWidth: '640px' }}>
              Browse through our portfolio of performance hypercars, grand tourers, and experimental prototypes.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter & Search Control Console */}
        <ScrollReveal variant="clip-up">
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--color-hairline)',
            padding: '1.5rem 2rem',
            marginBottom: '3rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            
            {/* Top Row: Search Input + Sorting */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
              
              {/* Search Input */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-surface-low)',
                border: '1px solid var(--color-hairline)',
                padding: '0.65rem 1rem',
                width: '100%',
                maxWidth: '420px',
                transition: 'border-color 0.2s'
              }}>
                <Search size={18} style={{ color: 'var(--color-muted)', marginRight: '0.75rem' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, V8/V12, or specs..."
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    width: '100%'
                  }}
                />
              </div>

              {/* Sorting Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="label-caps" style={{ color: 'var(--color-muted)' }}>SORT SPEC:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-dark"
                  style={{ padding: '0.65rem 1rem', width: 'auto', cursor: 'pointer' }}
                >
                  <option value="featured">Featured Atelier Order</option>
                  <option value="hp-desc">Horsepower (Highest First)</option>
                  <option value="speed-desc">Top Speed (Highest First)</option>
                  <option value="accel-asc">Acceleration (0-100 Fastest)</option>
                  <option value="price-desc">Price (Highest First)</option>
                </select>
              </div>
            </div>

            {/* Bottom Row: Category Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid var(--color-hairline)', paddingTop: '1.25rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: selectedCategory.toLowerCase() === cat.toLowerCase() ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedCategory.toLowerCase() === cat.toLowerCase() ? '#ffffff' : 'var(--color-secondary)',
                    border: '1px solid',
                    borderColor: selectedCategory.toLowerCase() === cat.toLowerCase() ? 'var(--accent-red)' : 'var(--color-hairline)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Results Counter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
          <span>DISPLAYING {filteredCars.length} VEHICLES</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
            >
              CLEAR SEARCH FILTER [X]
            </button>
          )}
        </div>

        {/* Cars Grid with AnimatePresence */}
        {filteredCars.length === 0 ? (
          <ScrollReveal variant="fade-up">
            <div style={{
              padding: '5rem 2rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px dashed var(--color-hairline)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                NO VEHICLES LOCATED
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>
                No supercar matches the selected criteria. Try adjusting your search term or category filter.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                className="btn-primary"
              >
                RESET ALL FILTERS
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '2.5rem'
            }}
          >
            <AnimatePresence>
              {filteredCars.map((car) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
