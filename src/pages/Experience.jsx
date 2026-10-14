/* ==========================================================================
   EXPERIENCE PAGE ("EXPERIENCE IT YOURSELF")
   Private Proving Ground Test Drive Booking, VIP Concierge, and Atelier Network
   with telemetry track dynamics, ScrollReveal, and interactive feedback
   ========================================================================== */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle2, Shield, Award, Navigation, Gauge, Zap, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCars } from '../context/CarContext';
import { storage } from '../utils/storage';
import ScrollReveal from '../components/ScrollReveal';

const PROVING_CIRCUITS = [
  {
    id: 'zurich',
    name: 'Zurich Atelier & Proving Ground',
    location: 'Switzerland',
    length: '4.85 KM',
    turns: '14 Turns',
    maxSpeed: '345 KM/H',
    desc: 'Alpine elevation changes, high-speed banking, and FIA Grade 1 telemetry timing loops.'
  },
  {
    id: 'monaco',
    name: 'Monaco Private Harbour Office',
    location: 'Monaco',
    length: '3.34 KM',
    turns: '19 Turns',
    maxSpeed: '290 KM/H',
    desc: 'Coastal grand prix sector evaluation with private yacht marina hospitality.'
  },
  {
    id: 'silverstone',
    name: 'Silverstone Dynamic Handling Center',
    location: 'United Kingdom',
    length: '5.89 KM',
    turns: '18 Turns',
    maxSpeed: '330 KM/H',
    desc: 'Legendary high-speed sweepers optimized for active aerodynamic downforce calibrations.'
  },
  {
    id: 'dubai',
    name: 'Dubai Autodrome Atelier',
    location: 'United Arab Emirates',
    length: '5.39 KM',
    turns: '16 Turns',
    maxSpeed: '350 KM/H',
    desc: 'High-temperature thermal testing, illuminated night sprint sessions, and drag surface.'
  }
];

export default function Experience() {
  const { cars } = useCars();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    modelId: 'valkyrie-vision',
    location: 'Zurich Atelier & Proving Ground',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedCircuit = PROVING_CIRCUITS.find(c => c.name === formData.location) || PROVING_CIRCUITS[0];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full legal client name required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid private email required';
    if (!formData.phone.trim()) errs.phone = 'Telephone contact required';
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
        particleCount: 75,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff3847', '#ffffff', '#8e939c']
      });
    } catch {
      // ignore
    }

    setIsSubmitted(true);
  };

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '7rem', backgroundColor: '#06070a', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Header */}
        <ScrollReveal variant="fade-up">
          <div style={{ marginBottom: '4rem', maxWidth: '780px' }}>
            <div className="telemetry-badge" style={{ marginBottom: '1rem' }}>
              <span>VIP CLIENT SERVICES // CIRCUIT DYNAMICS</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800 }}>
              EXPERIENCE IT YOURSELF
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', color: 'var(--color-secondary)' }}>
              Step beyond theoretical statistics. Command 1,000+ horsepower on private proving circuits accompanied by factory test drivers.
            </p>
          </div>
        </ScrollReveal>

        {/* Experience Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {[
            {
              title: 'Dynamic Circuit Evaluation',
              tag: 'HIGH SPEED PROVING',
              desc: 'Telemetry-instrumented track sessions evaluating transient lateral grip, launch control, and active aero response.'
            },
            {
              title: 'Factory Atelier Tour',
              tag: 'ZURICH MONOCOQUE HUB',
              desc: 'Private access inside our cleanroom autoclaves and hand-finished upholstery studios where commissions take life.'
            },
            {
              title: 'Bespoke Private Delivery',
              tag: 'WHITE GLOVE LOGISTICS',
              desc: 'Enclosed titanium transporter delivery to your private hangar, villa, or international circuit paddock.'
            }
          ].map((item, idx) => (
            <ScrollReveal key={item.title} variant="fade-up" delay={idx * 0.1}>
              <div
                style={{
                  backgroundColor: 'var(--bg-surface-card)',
                  border: '1px solid var(--color-hairline)',
                  padding: '2rem',
                  height: '100%',
                  transition: 'border-color 0.3s, transform 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,56,71,0.5)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-hairline)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span className="label-caps" style={{ color: 'var(--accent-red)', display: 'block', marginBottom: '0.75rem' }}>
                  {item.tag}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-secondary)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Selected Circuit Dynamic Telemetry Card */}
        <ScrollReveal variant="clip-up">
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--color-hairline)',
            padding: '2rem 2.5rem',
            marginBottom: '4rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div>
              <div className="telemetry-badge" style={{ marginBottom: '0.5rem' }}>
                <Compass size={13} style={{ color: 'var(--accent-red)' }} />
                <span>SELECTED PROVING GROUND // {selectedCircuit.location.toUpperCase()}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800 }}>
                {selectedCircuit.name}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-secondary)', maxWidth: '520px', marginTop: '0.25rem' }}>
                {selectedCircuit.desc}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '2.5rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)', display: 'block', letterSpacing: '0.1em' }}>CIRCUIT LENGTH</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{selectedCircuit.length}</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)', display: 'block', letterSpacing: '0.1em' }}>CORNER TURNS</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{selectedCircuit.turns}</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)', display: 'block', letterSpacing: '0.1em' }}>STRAIGHTAWAY MAX</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-red)' }}>{selectedCircuit.maxSpeed}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Form Console */}
        <ScrollReveal variant="fade-up">
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--color-hairline)',
            padding: 'clamp(1.5rem, 5vw, 3rem)',
            maxWidth: '820px',
            margin: '0 auto'
          }}>
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle2 size={56} style={{ color: 'var(--accent-emerald)', margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  EXPERIENCE ALLOCATION SECURED
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-secondary)', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                  Your private proving ground test drive for the {cars.find(c => c.id === formData.modelId)?.name} at {formData.location} has been cataloged. Our Chief Concierge will coordinate telephone confirmation within 2 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="btn-secondary"
                >
                  BOOK ANOTHER APPOINTMENT
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    SCHEDULE YOUR PRIVATE TEST DRIVE
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-secondary)' }}>
                    All sessions include professional telemetry instruction, racing suit fitting, and private circuit lounge access.
                  </p>
                </div>

                {/* Model Select */}
                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>SELECT PREFERRED VEHICLE</label>
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

                {/* Location Select */}
                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>CIRCUIT PROVING LOCATION</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-dark"
                  >
                    {PROVING_CIRCUITS.map((p) => (
                      <option key={p.id} value={p.name} style={{ backgroundColor: '#111318', color: '#fff' }}>
                        {p.name} ({p.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
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
                    <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>PRIVATE EMAIL ADDRESS</label>
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

                {/* Phone & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
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
                    <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>PREFERRED EVALUATION DATE</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="input-dark"
                    />
                    {errors.date && <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{errors.date}</span>}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>SPECIAL REQUESTS / TELEMETRY PREFERENCES</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Note specific track modes, guest requirements, or transport logistics..."
                    className="input-dark"
                    style={{ resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-accent chamfer-btn"
                  style={{ width: '100%', padding: '1.125rem', marginTop: '1rem' }}
                >
                  REQUEST EXPERIENCE // DISPATCH CONCIERGE
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
