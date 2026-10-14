/* ==========================================================================
   ANIMATED COUNTER COMPONENT
   Smooth numeric interpolation with customizable duration and suffix
   ========================================================================== */

import React, { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ 
  value, 
  duration = 1600, 
  decimals = 0, 
  prefix = '', 
  suffix = '',
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef(null);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) {
        setHasStarted(true);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let animationFrame;
    const startVal = 0;
    const endVal = parseFloat(value);

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quartic ease out
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = startVal + (endVal - startVal) * ease;
      
      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, hasStarted]);

  return (
    <span ref={elementRef} className={`font-mono ${className}`}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
