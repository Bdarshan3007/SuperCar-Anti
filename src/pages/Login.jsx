/* ==========================================================================
   LOGIN PAGE (VIP CLIENT AUTHENTICATION)
   Demo authentication with instant Guest and Admin 1-click access
   ========================================================================== */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginAsGuest, loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your client email');
      return;
    }
    login(email, password);
    navigate('/profile');
  };

  const handleGuest = () => {
    loginAsGuest();
    navigate('/profile');
  };

  const handleAdmin = () => {
    loginAsAdmin();
    navigate('/admin');
  };

  return (
    <div style={{
      paddingTop: '8rem',
      paddingBottom: '7rem',
      backgroundColor: '#06070a',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--color-hairline)',
            padding: '2.5rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}
        >
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '10px',
              height: '10px',
              backgroundColor: 'var(--accent-red)',
              transform: 'rotate(45deg)',
              margin: '0 auto 1rem'
            }} />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              CLIENT ACCESS
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-secondary)' }}>
              Enter your credentials to access saved builds and private atelier reservations.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ backgroundColor: 'rgba(255, 56, 71, 0.1)', border: '1px solid var(--accent-red)', padding: '0.75rem', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                {error}
              </div>
            )}

            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@supercar.atelier"
                className="input-dark"
              />
            </div>

            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>SECURITY PASSCODE</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-dark"
              />
            </div>

            <button
              type="submit"
              className="btn-accent chamfer-btn"
              style={{ width: '100%', padding: '0.875rem', marginTop: '0.5rem' }}
            >
              AUTHENTICATE ACCESS
            </button>
          </form>

          {/* Quick 1-Click Demo Logins */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-hairline)' }}>
            <span className="label-caps" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', color: 'var(--color-muted)' }}>
              QUICK DEMO ACCELERATORS
            </span>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleGuest}
                className="btn-secondary"
                style={{ flex: 1, padding: '0.65rem', fontSize: '0.6875rem' }}
              >
                <UserCheck size={14} />
                <span>GUEST VIP</span>
              </button>

              <button
                onClick={handleAdmin}
                className="btn-secondary"
                style={{ flex: 1, padding: '0.65rem', fontSize: '0.6875rem' }}
              >
                <ShieldCheck size={14} style={{ color: 'var(--accent-red)' }} />
                <span>ADMIN CONSOLE</span>
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
              New client?{' '}
              <Link to="/register" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>
                Create Atelier Account
              </Link>
            </span>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
