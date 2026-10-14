/* ==========================================================================
   CUSTOM CURSOR COMPONENT (UPGRADED MOTION & LIFECYCLE)
   Inertia damping ring, dynamic contextual states: VIEW, EXPLORE, DRAG, HOVER
   Single lifecycle listener attachment, zero dependency loops, full a11y support
   ========================================================================== */

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [mode, setMode] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  
  // Real mouse position
  const mouse = useRef({ x: -100, y: -100 });
  // Interpolated smoothed cursor position
  const ringPos = useRef({ x: -100, y: -100 });
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Strictly disable on touch, coarse pointers, or when reduced motion is preferred
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || prefersReducedMotion) {
      return;
    }

    setEnabled(true);

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseOver = (e) => {
      const dragEl = e.target.closest('.cursor-drag-target, .viewport-360');
      const exploreEl = e.target.closest('.car-card, .collection-card');
      const viewEl = e.target.closest('.cursor-view-target, .gallery-item');
      const buttonEl = e.target.closest('button, a, input, select, textarea, .interactive');

      if (dragEl) {
        setMode('drag');
      } else if (exploreEl) {
        setMode('explore');
      } else if (viewEl) {
        setMode('view');
      } else if (buttonEl) {
        setMode('hover');
      } else {
        setMode('default');
      }
    };

    const onMouseLeaveDoc = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveDoc, { passive: true });

    // Smooth inertia render loop for the trailing ring
    let rafId;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const loop = () => {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.22);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.22);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeaveDoc);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled || !isVisible) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div 
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: isVisible ? 1 : 0
        }}
      />

      {/* Lagging Contextual Ring */}
      <div 
        ref={ringRef}
        className={`custom-cursor-ring cursor-${mode}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: isVisible ? 1 : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {(mode === 'view' || mode === 'explore' || mode === 'drag') && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            color: '#ffffff',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            {mode}
          </span>
        )}
      </div>

      <style>{`
        .custom-cursor-ring.cursor-default {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255, 255, 255, 0.35);
        }
        .custom-cursor-ring.cursor-hover {
          width: 56px;
          height: 56px;
          border-color: var(--accent-red);
          background-color: rgba(230, 57, 70, 0.08);
        }
        .custom-cursor-ring.cursor-view, 
        .custom-cursor-ring.cursor-explore, 
        .custom-cursor-ring.cursor-drag {
          width: 68px;
          height: 68px;
          border-color: #ffffff;
          background-color: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(4px);
        }
        .custom-cursor-ring.cursor-drag {
          border-color: var(--accent-red);
        }
      `}</style>
    </>
  );
}
