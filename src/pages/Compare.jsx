/* ==========================================================================
   COMPARE CARS PAGE
   Interactive side-by-side comparison for up to 3 cars with animated bars,
   image fallbacks, and safe telemetry benchmarks
   ========================================================================== */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowRight, Trophy, Zap, Gauge, Flame, Wind, RotateCcw } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { storage } from '../utils/storage';
import { formatCurrency, formatSpeed, formatPower, formatTorque, formatAcceleration } from '../utils/formatters';
import ImageWithFallback from '../components/ImageWithFallback';
import ScrollReveal from '../components/ScrollReveal';

export default function Compare() {
  const { cars } = useCars();
  const [selectedIds, setSelectedIds] = useState(() => {
    const raw = storage.getComparisonIds();
    return Array.isArray(raw) ? raw : [];
  });

  // Safely filter against active cars in the registry
  const selectedCars = (Array.isArray(selectedIds) ? selectedIds : [])
    .map(id => cars.find(c => c && c.id === id))
    .filter(Boolean);

  const handleAddCar = (carId) => {
    if (selectedIds.length < 3 && !selectedIds.includes(carId)) {
      const updated = [...selectedIds, carId];
      setSelectedIds(updated);
      storage.setComparisonIds(updated);
    }
  };

  const handleRemoveCar = (carId) => {
    const updated = selectedIds.filter(id => id !== carId);
    setSelectedIds(updated);
    storage.setComparisonIds(updated);
  };

  const handleResetComparison = () => {
    const defaultIds = ['velaris-x1', 'nero-r'];
    setSelectedIds(defaultIds);
    storage.setComparisonIds(defaultIds);
  };

  // Safe telemetry calculation - avoid -Infinity / NaN / Infinity on empty or single fleet
  const hasMultipleCars = selectedCars.length >= 2;
  const hasCars = selectedCars.length > 0;

  const maxHp = hasCars ? Math.max(...selectedCars.map(c => Number(c.horsepower) || 0)) : 0;
  const maxTorque = hasCars ? Math.max(...selectedCars.map(c => Number(c.torque) || 0)) : 0;
  const minAccel = hasCars ? Math.min(...selectedCars.map(c => Number(c.acceleration) || 99)) : 0;
  const maxSpeed = hasCars ? Math.max(...selectedCars.map(c => Number(c.topSpeed) || 0)) : 0;
  const minPrice = hasCars ? Math.min(...selectedCars.map(c => Number(c.price) || 99999999)) : 0;

  const availableToAdd = cars.filter(c => !selectedIds.includes(c.id));

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '7rem', backgroundColor: '#06070a', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <div style={{ marginBottom: '3.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}>
            <div>
              <div className="telemetry-badge" style={{ marginBottom: '0.75rem' }}>
                <span>TELEMETRY BENCHMARK // SIDE-BY-SIDE</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800 }}>
                COMPARE SPECIFICATIONS
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', color: 'var(--color-secondary)', maxWidth: '640px' }}>
                Evaluate performance benchmarks, weight distribution, and powertrain characteristics side-by-side.
              </p>
            </div>

            {selectedCars.length > 0 && (
              <button
                onClick={handleResetComparison}
                className="btn-secondary"
                style={{ padding: '0.55rem 1rem', fontSize: '0.6875rem' }}
              >
                <RotateCcw size={14} />
                <span>RESET DEFAULT FLEET</span>
              </button>
            )}
          </div>
        </ScrollReveal>

        {/* Empty State */}
        {selectedCars.length === 0 ? (
          <ScrollReveal variant="fade-up">
            <div style={{
              padding: '6rem 2rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px dashed var(--color-hairline)'
            }}>
              <Gauge size={48} style={{ color: 'var(--color-muted)', margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
                NO VEHICLES IN COMPARISON MATRIX
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-secondary)', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
                Select up to 3 models from the showroom to benchmark horsepower, aerodynamics, and weight-to-power ratios side-by-side.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleResetComparison}
                  className="btn-accent chamfer-btn"
                >
                  LOAD DEFAULT COMPARISON (VELARIS X1 VS NERO R)
                </button>
                <Link to="/cars" className="btn-secondary">
                  EXPLORE THE FLEET
                </Link>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <>
            {/* Notification if only 1 vehicle is selected */}
            {selectedCars.length === 1 && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--color-hairline)',
                padding: '0.85rem 1.25rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-muted)'
              }}>
                <span>ADD AT LEAST 1 MORE VEHICLE BELOW TO ACTIVATE HEAD-TO-HEAD BENCHMARK TROPHIES.</span>
              </div>
            )}

            {/* Selected Vehicles Header Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${selectedCars.length + (selectedCars.length < 3 ? 1 : 0)}, minmax(min(100%, 280px), 1fr))`,
              gap: '1.5rem',
              marginBottom: '3rem',
              overflowX: 'auto'
            }}>
              <AnimatePresence>
                {selectedCars.map((car) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--color-hairline)',
                      padding: '1.5rem',
                      position: 'relative'
                    }}
                  >
                    <button
                      onClick={() => handleRemoveCar(car.id)}
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid var(--color-hairline)',
                        color: 'var(--color-muted)',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 5,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--accent-red)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.borderColor = 'var(--color-hairline)'; }}
                      title="Remove car from comparison"
                      aria-label={`Remove ${car.name} from comparison`}
                    >
                      <X size={15} />
                    </button>

                    <div style={{ width: '100%', height: '150px', marginBottom: '1rem', overflow: 'hidden' }}>
                      <ImageWithFallback
                        src={car.image}
                        alt={car.name}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
                      <div style={{ width: '5px', height: '5px', backgroundColor: 'var(--accent-red)', transform: 'rotate(45deg)' }} />
                      <span className="label-caps" style={{ fontSize: '0.625rem' }}>{car.category}</span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {car.name}
                    </h3>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-red)', marginBottom: '1.25rem' }}>
                      {formatCurrency(car.price)}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link
                        to={`/cars/${car.id}`}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.6875rem', textAlign: 'center' }}
                      >
                        DETAILS
                      </Link>
                      <Link
                        to={`/configurator/${car.id}`}
                        className="btn-accent"
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.6875rem', textAlign: 'center' }}
                      >
                        CONFIGURE
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Vehicle Slot */}
              {selectedCars.length < 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.01)',
                    border: '1px dashed var(--color-hairline)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '260px',
                    textAlign: 'center'
                  }}
                >
                  <span className="label-caps" style={{ marginBottom: '1rem', color: 'var(--color-secondary)' }}>
                    + ADD VEHICLE TO COMPARE
                  </span>
                  {availableToAdd.length > 0 ? (
                    <select
                      onChange={(e) => {
                        if (e.target.value) handleAddCar(e.target.value);
                      }}
                      defaultValue=""
                      className="input-dark"
                      style={{ width: 'auto', padding: '0.65rem 1rem', cursor: 'pointer' }}
                    >
                      <option value="" disabled>Select vehicle...</option>
                      {availableToAdd.map(c => (
                        <option key={c.id} value={c.id} style={{ backgroundColor: '#111318', color: '#fff' }}>
                          {c.name} ({formatPower(c.horsepower)})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                      ALL MODELS IN MATRIX
                    </span>
                  )}
                </motion.div>
              )}
            </div>

            {/* Comparison Table with Graphical Telemetry Bars */}
            <ScrollReveal variant="clip-up">
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--color-hairline)',
                overflowX: 'auto'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-hairline)', backgroundColor: 'var(--bg-surface-low)' }}>
                      <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--color-muted)', width: '280px' }}>
                        SPECIFICATION METRIC
                      </th>
                      {selectedCars.map(c => (
                        <th key={c.id} style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700 }}>
                          {c.name.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    
                    {/* Horsepower */}
                    <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Zap size={14} style={{ color: 'var(--accent-red)' }} />
                          <span>HORSEPOWER (HP)</span>
                        </div>
                      </td>
                      {selectedCars.map(c => {
                        const pct = Math.min(100, Math.round(((Number(c.horsepower) || 0) / 1200) * 100));
                        const isBest = hasMultipleCars && c.horsepower === maxHp;
                        return (
                          <td key={c.id} style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600 }}>
                              <span style={{ color: isBest ? 'var(--accent-red)' : '#fff' }}>
                                {formatPower(c.horsepower)}
                              </span>
                              {isBest && <Trophy size={14} style={{ color: 'var(--accent-red)' }} />}
                            </div>
                            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                  height: '100%',
                                  backgroundColor: isBest ? 'var(--accent-red)' : 'var(--color-muted)'
                                }}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Torque */}
                    <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Flame size={14} style={{ color: 'var(--accent-red)' }} />
                          <span>PEAK TORQUE (NM)</span>
                        </div>
                      </td>
                      {selectedCars.map(c => {
                        const pct = Math.min(100, Math.round(((Number(c.torque) || 0) / 1400) * 100));
                        const isBest = hasMultipleCars && c.torque === maxTorque;
                        return (
                          <td key={c.id} style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600 }}>
                              <span style={{ color: isBest ? 'var(--accent-red)' : '#fff' }}>
                                {formatTorque(c.torque)}
                              </span>
                              {isBest && <Trophy size={14} style={{ color: 'var(--accent-red)' }} />}
                            </div>
                            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                  height: '100%',
                                  backgroundColor: isBest ? 'var(--accent-red)' : 'var(--color-muted)'
                                }}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* 0-100 Accel */}
                    <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Gauge size={14} style={{ color: 'var(--accent-red)' }} />
                          <span>0 → 100 KM/H</span>
                        </div>
                      </td>
                      {selectedCars.map(c => {
                        const accel = Number(c.acceleration) || 3.0;
                        const pct = Math.round(Math.max(20, Math.min(100, (1 - (accel - 2.0) / 1.5) * 100)));
                        const isBest = hasMultipleCars && c.acceleration === minAccel;
                        return (
                          <td key={c.id} style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600 }}>
                              <span style={{ color: isBest ? 'var(--accent-red)' : '#fff' }}>
                                {formatAcceleration(c.acceleration)}
                              </span>
                              {isBest && <Trophy size={14} style={{ color: 'var(--accent-red)' }} />}
                            </div>
                            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                  height: '100%',
                                  backgroundColor: isBest ? 'var(--accent-red)' : 'var(--color-muted)'
                                }}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Top Speed */}
                    <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Wind size={14} style={{ color: 'var(--accent-red)' }} />
                          <span>TOP SPEED</span>
                        </div>
                      </td>
                      {selectedCars.map(c => {
                        const pct = Math.min(100, Math.round(((Number(c.topSpeed) || 0) / 420) * 100));
                        const isBest = hasMultipleCars && c.topSpeed === maxSpeed;
                        return (
                          <td key={c.id} style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600 }}>
                              <span style={{ color: isBest ? 'var(--accent-red)' : '#fff' }}>
                                {formatSpeed(c.topSpeed)}
                              </span>
                              {isBest && <Trophy size={14} style={{ color: 'var(--accent-red)' }} />}
                            </div>
                            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                  height: '100%',
                                  backgroundColor: isBest ? 'var(--accent-red)' : 'var(--color-muted)'
                                }}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Engine */}
                    <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
                        ENGINE ARCHITECTURE
                      </td>
                      {selectedCars.map(c => (
                        <td key={c.id} style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#fff' }}>
                          {c.engine}
                        </td>
                      ))}
                    </tr>

                    {/* Drive */}
                    <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
                        DRIVETRAIN
                      </td>
                      {selectedCars.map(c => (
                        <td key={c.id} style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#fff' }}>
                          {c.drive}
                        </td>
                      ))}
                    </tr>

                    {/* Weight */}
                    <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
                        CURB WEIGHT
                      </td>
                      {selectedCars.map(c => (
                        <td key={c.id} style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#fff' }}>
                          {c.weight}
                        </td>
                      ))}
                    </tr>

                    {/* Price */}
                    <tr>
                      <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
                        STARTING COMMISSION
                      </td>
                      {selectedCars.map(c => (
                        <td key={c.id} style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: hasMultipleCars && c.price === minPrice ? 'var(--accent-red)' : '#fff' }}>
                          {formatCurrency(c.price)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
}
