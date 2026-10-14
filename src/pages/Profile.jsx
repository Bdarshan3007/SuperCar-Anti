/* ==========================================================================
   USER PROFILE PAGE
   VIP client profile, saved bespoke configurations, and test drive booking records
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Bookmark, Calendar, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import { formatCurrency } from '../utils/formatters';

export default function Profile() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [savedConfigs, setSavedConfigs] = useState(() => storage.getConfigurations());
  const [testDrives, setTestDrives] = useState(() => storage.getTestDrives());

  // Declarative redirect outside of render cycle
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleDeleteConfig = (id) => {
    const updated = storage.deleteConfiguration(id);
    setSavedConfigs(updated);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '7rem', backgroundColor: '#06070a', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Profile Card Header */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--color-hairline)',
          padding: '2.5rem',
          marginBottom: '3.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--color-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-red)'
            }}>
              <User size={32} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800 }}>
                  {user.name}
                </h1>
                <span className="telemetry-badge" style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>
                  {user.role}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-secondary)' }}>
                {user.email} // {user.tier} // {user.atelierNode}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {isAdmin && (
              <Link to="/admin" className="btn-secondary">
                <ShieldCheck size={16} style={{ color: 'var(--accent-red)' }} />
                <span>ADMIN CONSOLE</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              <LogOut size={16} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Section 1: Saved Bespoke Configurations */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span className="label-caps" style={{ color: 'var(--accent-red)' }}>ATELIER PORTFOLIO</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700 }}>
                SAVED CONFIGURATIONS ({savedConfigs.length})
              </h2>
            </div>
            <Link to="/configurator" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.6875rem' }}>
              + NEW CONFIGURATION
            </Link>
          </div>

          {savedConfigs.length === 0 ? (
            <div style={{ padding: '3rem', backgroundColor: 'var(--bg-surface-low)', border: '1px dashed var(--color-hairline)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
              NO BESPOKE BUILDS SAVED YET. BUILD ONE IN THE CONFIGURATOR.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {savedConfigs.map((cfg) => (
                <div
                  key={cfg.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-card)',
                    border: '1px solid var(--color-hairline)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="label-caps">{cfg.id}</span>
                      <button
                        onClick={() => handleDeleteConfig(cfg.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer' }}
                        title="Delete saved configuration"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {cfg.carName}
                    </h3>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      <div>FINISH: {cfg.color?.name}</div>
                      <div>WHEELS: {cfg.wheel?.name}</div>
                      <div>INTERIOR: {cfg.interior?.name}</div>
                      <div>PACKAGE: {cfg.package?.name}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-hairline)' }}>
                    <div>
                      <span className="label-caps" style={{ fontSize: '0.5625rem', color: 'var(--color-muted)' }}>TOTAL VALUE</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                        {formatCurrency(cfg.totalPrice)}
                      </div>
                    </div>

                    <Link to="/configurator" className="btn-secondary" style={{ padding: '0.45rem 0.75rem', fontSize: '0.6875rem' }}>
                      EDIT BUILD
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Active Test Drive Inquiries */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="label-caps" style={{ color: 'var(--accent-red)' }}>PROVING GROUND ACCESS</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700 }}>
              YOUR TEST DRIVE SESSIONS ({testDrives.length})
            </h2>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--color-hairline)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-low)', borderBottom: '1px solid var(--color-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>RESERVATION ID</th>
                  <th style={{ padding: '1rem 1.5rem' }}>VEHICLE</th>
                  <th style={{ padding: '1rem 1.5rem' }}>LOCATION</th>
                  <th style={{ padding: '1rem 1.5rem' }}>DATE</th>
                  <th style={{ padding: '1rem 1.5rem' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {testDrives.map((td) => (
                  <tr key={td.id} style={{ borderBottom: '1px solid var(--color-hairline)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-muted)' }}>{td.id}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#fff' }}>{td.modelName}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-secondary)' }}>{td.location}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{td.date}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className="telemetry-badge" style={{
                        color: td.status === 'Confirmed' ? 'var(--accent-emerald)' : 'var(--accent-gold)',
                        borderColor: td.status === 'Confirmed' ? 'var(--accent-emerald)' : 'var(--accent-gold)'
                      }}>
                        {td.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
