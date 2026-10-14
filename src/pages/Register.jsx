/* ==========================================================================
   REGISTER PAGE (CREATE VIP ATELIER ACCOUNT)
   ========================================================================== */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please provide legal name and email');
      return;
    }
    register(name, email, password);
    navigate('/profile');
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
              CREATE ATELIER ACCOUNT
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-secondary)' }}>
              Register for exclusive allocation rights and digital garage persistence.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ backgroundColor: 'rgba(255, 56, 71, 0.1)', border: '1px solid var(--accent-red)', padding: '0.75rem', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                {error}
              </div>
            )}

            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>FULL LEGAL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julian Sterling"
                className="input-dark"
              />
            </div>

            <div>
              <label className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>PRIVATE EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sterling@client.com"
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
              REGISTER ATELIER ACCOUNT
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
              Existing client?{' '}
              <Link to="/login" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>
                Access Account
              </Link>
            </span>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
