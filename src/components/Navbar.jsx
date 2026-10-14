/* ==========================================================================
   NAVBAR COMPONENT (UPGRADED MOTION)
   Scroll-progress interpolated glassmorphic header, staggered mobile menu overlay,
   and animated favorites count badge
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Menu, X, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useFavorites } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Progress from 0 to 1 between 0px and 120px scroll
      const progress = Math.min(1, Math.max(0, window.scrollY / 120));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Global keyboard shortcut for search (Ctrl+K on Win/Linux, Cmd+K on macOS)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        const active = document.activeElement;
        const tag = active ? active.tagName.toLowerCase() : '';
        const isEditable = active?.isContentEditable;
        // Ignore if user is actively typing in a standard input or textarea
        if ((tag === 'input' || tag === 'textarea' || isEditable) && !active.closest('[role="dialog"]')) {
          return;
        }
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'CARS', path: '/cars' },
    { label: 'CONFIGURATOR', path: '/configurator' },
    { label: 'COLLECTIONS', path: '/collections' },
    { label: 'COMPARE', path: '/compare' },
    { label: 'EXPERIENCE', path: '/experience' },
    { label: 'JOURNAL', path: '/journal' }
  ];

  // Interpolated Navbar Styles based on scroll progress
  const navHeight = 88 - scrollProgress * 20; // 88px -> 68px
  const bgAlpha = scrollProgress * 0.88;
  const blurAmount = scrollProgress * 24;
  const borderAlpha = scrollProgress * 0.12;
  const navSpacing = 2.25 - scrollProgress * 0.45; // 2.25rem -> 1.8rem
  const logoScale = 1 - scrollProgress * 0.05;

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9990,
          height: `${navHeight}px`,
          backgroundColor: `rgba(6, 7, 10, ${bgAlpha})`,
          backdropFilter: `blur(${blurAmount}px) saturate(140%)`,
          WebkitBackdropFilter: `blur(${blurAmount}px) saturate(140%)`,
          borderBottom: `1px solid rgba(255, 255, 255, ${borderAlpha})`,
          display: 'flex',
          alignItems: 'center',
          transition: 'height 0.15s ease-out, background-color 0.15s ease-out'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo with Smooth Scale */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: '#ffffff',
              transform: `scale(${logoScale})`,
              transformOrigin: 'left center',
              transition: 'transform 0.2s ease-out'
            }}
          >
            <div style={{
              width: '10px',
              height: '10px',
              backgroundColor: 'var(--accent-red)',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 12px var(--accent-red)'
            }} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.24em',
                textTransform: 'uppercase'
              }}>
                AURA
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: 'var(--color-muted)',
                letterSpacing: '0.16em'
              }}>
                SUPERCAR
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Responsive Tightening */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: `${navSpacing}rem`,
              transition: 'gap 0.2s ease-out'
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  color: isActive ? '#ffffff' : 'var(--color-secondary)',
                  position: 'relative',
                  padding: '0.25rem 0',
                  transition: 'color 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                })}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        style={{
                          position: 'absolute',
                          bottom: '-4px',
                          left: 0,
                          right: 0,
                          height: '2px',
                          backgroundColor: 'var(--accent-red)',
                          boxShadow: '0 0 8px var(--accent-red)'
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search Collection (Ctrl+K or Cmd+K)"
              title="Search Collection (Ctrl+K / Cmd+K)"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '6px',
                transition: 'color 0.2s, transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-red)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-primary)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Search size={18} />
              <span
                className="desktop-only"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--color-muted)',
                  border: '1px solid var(--color-hairline)',
                  padding: '1px 5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  letterSpacing: '0.05em'
                }}
              >
                ⌘K
              </span>
            </button>

            {/* Favorites Badge (♡ 02) */}
            <Link
              to="/favorites"
              aria-label="View Favorites"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: favoritesCount > 0 ? 'var(--accent-red)' : 'var(--color-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                padding: '0.35rem 0.65rem',
                border: '1px solid',
                borderColor: favoritesCount > 0 ? 'rgba(255, 56, 71, 0.35)' : 'var(--color-hairline)',
                backgroundColor: favoritesCount > 0 ? 'rgba(255, 56, 71, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-red)';
                e.currentTarget.style.boxShadow = '0 0 12px var(--accent-red-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = favoritesCount > 0 ? 'rgba(255, 56, 71, 0.35)' : 'var(--color-hairline)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Heart size={14} fill={favoritesCount > 0 ? 'var(--accent-red)' : 'none'} />
              <span>{favoritesCount.toString().padStart(2, '0')}</span>
            </Link>

            {/* VIP Profile Link */}
            <Link
              to={isAuthenticated ? (isAdmin ? '/admin' : '/profile') : '/login'}
              aria-label="User Account"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                border: '1px solid var(--color-hairline)',
                backgroundColor: isAuthenticated ? 'rgba(255, 56, 71, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                transition: 'all 0.2s'
              }}
              className="desktop-only"
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-red)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-hairline)'}
            >
              {isAdmin ? <ShieldCheck size={14} style={{ color: 'var(--accent-red)' }} /> : <User size={14} />}
              <span style={{ letterSpacing: '0.12em' }}>
                {isAuthenticated ? (isAdmin ? 'ADMIN' : 'VIP') : 'ACCESS'}
              </span>
            </Link>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'none',
                padding: '6px'
              }}
              className="mobile-menu-trigger"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Animated Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9980,
              backgroundColor: '#06070a',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '6rem 2.5rem 3rem'
            }}
          >
            {/* Top Brand Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-red)', transform: 'rotate(45deg)' }} />
              <span className="label-caps">AURA // NAVIGATION OVERLAY</span>
            </div>

            {/* Staggered Navigation Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: 'auto 0' }}>
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={({ isActive }) => ({
                      textDecoration: 'none',
                      fontFamily: 'var(--font-display)',
                      fontSize: '2.25rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: isActive ? 'var(--accent-red)' : '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    })}
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={20} style={{ opacity: 0.4 }} />
                  </NavLink>
                </motion.div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <Link
                to={isAuthenticated ? '/profile' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary chamfer-btn"
                style={{ flex: 1, textAlign: 'center' }}
              >
                {isAuthenticated ? 'MY PROFILE' : 'VIP LOGIN'}
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  ADMIN
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Responsive Breakpoint Helper */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-nav { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-menu-trigger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
