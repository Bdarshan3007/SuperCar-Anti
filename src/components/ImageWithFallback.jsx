/* ==========================================================================
   IMAGE WITH FALLBACK COMPONENT
   Graceful loading state with obsidian shimmer, error boundary, and responsive aspect
   ========================================================================== */

import React, { useState } from 'react';

export default function ImageWithFallback({
  src,
  alt = 'AURA Hypercar',
  className = '',
  style = {},
  aspectRatio = '16/9',
  onLoad,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const fallbackSrc = '/images/fallback-obsidian.svg';

  // Reset failure state if the src prop changes
  React.useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  const handleImageError = () => {
    // Error latch: if already in failed state or src is already fallback, do not retrigger
    if (failed || src === fallbackSrc) {
      setLoaded(true);
      return;
    }
    setFailed(true);
    setLoaded(true);
  };

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0c0e13',
        width: '100%',
        height: '100%',
        ...style
      }}
      className={`img-fallback-wrapper ${className}`}
    >
      {/* Shimmer Placeholder while loading */}
      {!loaded && !failed && (
        <div
          className="skeleton-shimmer"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1
          }}
        />
      )}

      {/* Actual Rendered Image */}
      <img
        src={failed ? fallbackSrc : src}
        alt={alt}
        loading="lazy"
        onLoad={(e) => {
          setLoaded(true);
          if (onLoad) onLoad(e);
        }}
        onError={handleImageError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        {...props}
      />
    </div>
  );
}
