/* ==========================================================================
   CAR CARD COMPONENT (UPGRADED MOTION & IMAGE CONSISTENCY)
   Subtle 2.5° 3D tilt, contextual cursor tag, image scale with shimmer fallback,
   and dynamic hover CTA reveal
   ========================================================================== */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowUpRight, Gauge, Zap, Wind } from 'lucide-react';
import { useFavorites } from '../context/FavoriteContext';
import ImageWithFallback from './ImageWithFallback';
import { formatCurrency, formatSpeed, formatPower, formatAcceleration } from '../utils/formatters';

export default function CarCard({ car }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const favorited = isFavorite(car.id);

  const handleMouseMove = (e) => {
    // Only apply on fine pointer devices (desktop)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Strict controlled 2.5° max tilt
    const rotateX = ((y - centerY) / centerY) * -2.5;
    const rotateY = ((x - centerX) / centerX) * 2.5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(car.id);
  };

  const handleCardClick = () => {
    navigate(`/cars/${car.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        backgroundColor: isHovered ? 'var(--bg-surface-elevated)' : 'var(--bg-surface-card)',
        border: isHovered ? '1px solid var(--accent-red)' : '1px solid var(--color-hairline)',
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? '-6px' : '0px'})`,
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, box-shadow 0.3s, background-color 0.3s',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 24px var(--accent-red-dim)' 
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
      className="car-card"
    >
      {/* Top Header Row with Model Category & Favorite Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--color-hairline)',
        zIndex: 2,
        backgroundColor: 'rgba(20, 23, 30, 0.85)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-red)', transform: 'rotate(45deg)' }} />
          <span className="label-caps">{car.category}</span>
        </div>

        <button
          onClick={handleFavoriteClick}
          aria-label="Toggle favorite"
          style={{
            background: 'none',
            border: 'none',
            color: favorited ? 'var(--accent-red)' : 'var(--color-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Heart size={18} fill={favorited ? 'var(--accent-red)' : 'none'} />
        </button>
      </div>

      {/* Image Showcase Container with Smooth Zoom & Shimmer */}
      <div style={{
        position: 'relative',
        height: '240px',
        overflow: 'hidden',
        backgroundColor: '#090b0f'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <ImageWithFallback
            src={car.image}
            alt={car.name}
          />
        </div>

        {/* Ambient Dark Bottom Gradient Scrim */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, var(--bg-surface-card) 0%, transparent 55%)',
          pointerEvents: 'none'
        }} />

        {/* 0-100 Acceleration Pill */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1.5rem',
          backgroundColor: 'rgba(6, 7, 10, 0.85)',
          border: '1px solid var(--color-hairline)',
          backdropFilter: 'blur(8px)',
          padding: '0.25rem 0.625rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.12em',
          color: '#ffffff'
        }}>
          0→100 <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>{formatAcceleration(car.acceleration)}</span>
        </div>
      </div>

      {/* Content Body */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          marginBottom: '0.25rem',
          color: '#ffffff'
        }}>
          {car.name}
        </h3>
        
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--color-secondary)',
          lineHeight: '1.45',
          marginBottom: '1.5rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {car.description}
        </p>

        {/* Telemetry Metric Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          padding: '0.875rem 0',
          borderTop: '1px solid var(--color-hairline)',
          borderBottom: '1px solid var(--color-hairline)',
          marginBottom: '1.5rem'
        }}>
          <div>
            <span className="label-caps" style={{ fontSize: '0.625rem', display: 'block', color: 'var(--color-muted)' }}>POWER</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
              {formatPower(car.horsepower)}
            </span>
          </div>
          <div>
            <span className="label-caps" style={{ fontSize: '0.625rem', display: 'block', color: 'var(--color-muted)' }}>TOP SPEED</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
              {formatSpeed(car.topSpeed)}
            </span>
          </div>
          <div>
            <span className="label-caps" style={{ fontSize: '0.625rem', display: 'block', color: 'var(--color-muted)' }}>DRIVE</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
              {car.drive.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Price & CTA Action Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto'
        }}>
          <div>
            <span className="label-caps" style={{ fontSize: '0.5625rem', display: 'block', color: 'var(--color-muted)' }}>ESTIMATED STARTING</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
              {formatCurrency(car.price)}
            </span>
          </div>

          <div
            className="chamfer-tag"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.875rem',
              backgroundColor: isHovered ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.05)',
              color: isHovered ? '#ffffff' : 'var(--color-primary)',
              border: '1px solid',
              borderColor: isHovered ? 'var(--accent-red)' : 'var(--color-hairline)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'translateX(2px)' : 'none'
            }}
          >
            <span>DETAILS</span>
            <ArrowUpRight
              size={14}
              style={{
                transform: isHovered ? 'translate(2px, -2px)' : 'none',
                transition: 'transform 0.25s ease'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
