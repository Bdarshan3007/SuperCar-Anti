/* ==========================================================================
   PAGE TRANSITION WRAPPER (UPGRADED MOTION & ACCESSIBILITY)
   Cinematic route exit & entrance animations with scale, opacity, and blur
   Clean reduced-motion bypass for vestibular accessibility
   ========================================================================== */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function PageTransition({ children }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div style={{ width: '100%' }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
