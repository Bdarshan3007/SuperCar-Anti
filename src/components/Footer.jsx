/* ==========================================================================
   FOOTER COMPONENT
   Architectural brand footer with newsletter, navigation clusters, and legal stamps
   ========================================================================== */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: 'var(--bg-core)', borderTop: '1px solid var(--color-hairline)' }}>
      {/* Upper Atelier Imprint */}
      <div className="container" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          
          {/* Brand Col */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--accent-red)', transform: 'rotate(45deg)' }} />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.24em',
                color: '#ffffff'
              }}>
                SUPERCAR
              </span>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-secondary)',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              Haute-performance hypercar engineering and digital automotive atelier. Designed for velocity, structural purity, and architectural presence.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--color-muted)'
            }}>
              <span className="telemetry-dot online" />
              <span>ATELIER NODE 01 // ZURICH - MONACO</span>
            </div>
          </div>

          {/* Explore Col */}
          <div>
            <div className="label-caps" style={{ marginBottom: '1.25rem', color: '#ffffff' }}>EXPLORE</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/cars" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--color-secondary)'}>
                  The Fleet (Cars)
                </Link>
              </li>
              <li>
                <Link to="/collections" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--color-secondary)'}>
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/configurator" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--color-secondary)'}>
                  Bespoke Configurator
                </Link>
              </li>
              <li>
                <Link to="/compare" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--color-secondary)'}>
                  Side-by-Side Compare
                </Link>
              </li>
            </ul>
          </div>

          {/* Experience Col */}
          <div>
            <div className="label-caps" style={{ marginBottom: '1.25rem', color: '#ffffff' }}>EXPERIENCE</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/experience" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--color-secondary)'}>
                  Test Drive Concierge
                </Link>
              </li>
              <li>
                <Link to="/journal" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--color-secondary)'}>
                  Editorial Journal
                </Link>
              </li>
              <li>
                <Link to="/favorites" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--color-secondary)'}>
                  Saved Vault
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--color-secondary)'}>
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Col */}
          <div>
            <div className="label-caps" style={{ marginBottom: '1.25rem', color: '#ffffff' }}>CONNECT</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Instagram', 'YouTube', 'Facebook', 'LinkedIn'].map((platform) => (
                <li key={platform}>
                  <a
                    href={`https://${platform.toLowerCase()}.com`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: 'var(--color-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-secondary)'}
                  >
                    <span>{platform}</span>
                    <ArrowUpRight size={12} style={{ color: 'var(--accent-red)' }} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--color-hairline)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: 'var(--color-muted)'
        }}>
          <div>
            SUPERCAR © 2026 MOTORWERKS AG. ALL RIGHTS RESERVED.
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--color-muted)'}>
              PRIVACY POLICY
            </span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--color-muted)'}>
              TERMS OF ALLOCATION
            </span>
            <button
              onClick={scrollToTop}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-red)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                cursor: 'pointer',
                letterSpacing: '0.12em'
              }}
            >
              [BACK TO TOP ↑]
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
