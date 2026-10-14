/* ==========================================================================
   TEST DRIVE / VIP INQUIRY MODAL COMPONENT (UPGRADED MOTION & LIFECYCLE)
   Form validation, LocalStorage storage, celebratory feedback,
   true AnimatePresence exit animations, body-scroll lock, and ESC key support
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Calendar, MapPin, Phone, Mail, User, Car } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCars } from '../context/CarContext';
import { storage } from '../utils/storage';

export default function TestDriveModal({ isOpen, onClose, defaultCarId }) {
  const { cars } = useCars();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    modelId: defaultCarId || (cars[0]?.id || ''),
    location: 'Zurich Atelier & Proving Ground',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Synchronize default model ID when prop changes
  useEffect(() => {
    if (defaultCarId) {
      setFormData(prev => ({ ...prev, modelId: defaultCarId }));
    }
  }, [defaultCarId]);

  // Lock background scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key for accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Client legal name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid private email required';
    if (!formData.phone.trim()) errs.phone = 'Contact telephone is required';
    if (!formData.date) errs.date = 'Reservation date required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedCar = cars.find(c => c.id === formData.modelId);
    storage.saveTestDrive({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      modelId: formData.modelId,
      modelName: selectedCar ? selectedCar.name : 'Valkyrie Vision',
      location: formData.location,
      date: formData.date,
      notes: formData.message
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e63946', '#ffffff', '#8e939c']
      });
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="test-drive-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99995,
            backgroundColor: 'rgba(9, 10, 12, 0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(0.75rem, 3vw, 1.5rem)'
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="test-drive-title"
        >
          <motion.div
            key="test-drive-modal-dialog"
            initial={{ scale: 0.96, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              maxWidth: '640px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--color-hairline)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(230, 57, 70, 0.12)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Top Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem clamp(1rem, 4vw, 2rem)',
              borderBottom: '1px solid var(--color-hairline)',
              backgroundColor: 'var(--bg-surface-low)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-red)', transform: 'rotate(45deg)' }} />
                <span className="label-caps">PRIVATE ALLOCATION // EXPERIENCE</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 'clamp(1rem, 4vw, 2rem)' }}>
              {isSubmitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <CheckCircle2 size={56} style={{ color: 'var(--accent-emerald)', margin: '0 auto 1.5rem' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                    ALLOCATION SECURED
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>
                    Your private concierge request has been recorded. An atelier director will coordinate directly within 2 business hours.
                  </p>
                  <div className="telemetry-badge" style={{ color: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}>
                    STATUS // CONCIERGE DISPATCHED
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <h3 id="test-drive-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                      EXPERIENCE IT YOURSELF
                    </h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-secondary)' }}>
                      Schedule an exclusive dynamic circuit evaluation or private showroom appointment.
                    </p>
                  </div>

                  {/* Preferred Model */}
                  <div>
                    <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>PREFERRED MODEL</label>
                    <select
                      value={formData.modelId}
                      onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                      className="input-dark"
                      style={{ cursor: 'pointer' }}
                    >
                      {cars.map((c) => (
                        <option key={c.id} value={c.id} style={{ backgroundColor: '#111318', color: '#fff' }}>
                          {c.name} ({c.engine} // {c.horsepower} HP)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name & Email Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>LEGAL FULL NAME</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Julian Sterling"
                        className="input-dark"
                      />
                      {errors.name && <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{errors.name}</span>}
                    </div>

                    <div>
                      <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sterling@client.com"
                        className="input-dark"
                      />
                      {errors.email && <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{errors.email}</span>}
                    </div>
                  </div>

                  {/* Phone & Date Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>DIRECT TELEPHONE</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+41 79 000 0000"
                        className="input-dark"
                      />
                      {errors.phone && <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{errors.phone}</span>}
                    </div>

                    <div>
                      <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>PREFERRED DATE</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="input-dark"
                      />
                      {errors.date && <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{errors.date}</span>}
                    </div>
                  </div>

                  {/* Location Picker */}
                  <div>
                    <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>ATELIER LOCATION</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="input-dark"
                    >
                      <option value="Zurich Atelier & Proving Ground">Zurich Atelier & Proving Ground</option>
                      <option value="Monaco Private Harbour Office">Monaco Private Harbour Office</option>
                      <option value="Silverstone Dynamic Handling Center">Silverstone Dynamic Handling Center</option>
                      <option value="Dubai Autodrome Atelier">Dubai Autodrome Atelier</option>
                    </select>
                  </div>

                  {/* Message / Special Requests */}
                  <div>
                    <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>SPECIAL COMMISSION REQUIREMENTS (OPTIONAL)</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify track telemetry preferences or bespoke atelier requests..."
                      className="input-dark"
                      style={{ resize: 'none' }}
                    />
                  </div>

                  {/* Submit Trigger */}
                  <button
                    type="submit"
                    className="btn-accent chamfer-btn"
                    style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
                  >
                    REQUEST EXPERIENCE // DISPATCH CONCIERGE
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
