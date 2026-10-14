/* ==========================================================================
   SCROLL REVEAL COMPONENT (UPGRADED MOTION & ACCESSIBILITY)
   Intentional viewport entrance animations: fade-up, fade-down, clip-up, clip-right, scale-in, mask
   Full support for both `effect` and `variant` props, fallback resilience, reduced-motion bypass
   ========================================================================== */

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export default function ScrollReveal({
  children,
  effect,
  variant, // Support both effect and variant props seamlessly
  delay = 0,
  duration = 0.8,
  threshold = 0.15,
  once = true,
  className = '',
  style = {}
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: threshold, once });
  const shouldReduceMotion = useReducedMotion();

  // If the user prefers reduced motion, bypass transform animations completely
  if (shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  // Variations matching the AURA Motion System
  const variants = {
    'fade-up': {
      hidden: { opacity: 0, y: 35 },
      visible: { opacity: 1, y: 0 }
    },
    'fade-down': {
      hidden: { opacity: 0, y: -25 },
      visible: { opacity: 1, y: 0 }
    },
    'clip-up': {
      hidden: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 15 },
      visible: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0 }
    },
    'clip-right': {
      hidden: { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0 },
      visible: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }
    },
    'scale-in': {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 }
    },
    'mask': {
      hidden: { opacity: 0, filter: 'blur(8px)', y: 20 },
      visible: { opacity: 1, filter: 'blur(0px)', y: 0 }
    }
  };

  const activeEffect = effect || variant || 'fade-up';
  const selectedVariant = variants[activeEffect] || variants['fade-up'];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={selectedVariant}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // Precision expo ease out
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
