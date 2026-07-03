'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Toast — a lightweight notification component.
 * Props:
 *  - message: string to display
 *  - visible: boolean
 *  - onClose: callback
 *  - type: 'info' | 'success' | 'warning' (default 'info')
 */
export default function Toast({ message, visible, onClose, type = 'info' }) {
  // Auto-dismiss after 4 s
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  const icons = {
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-amber-400 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-yellow-400 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-green-400 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] max-w-sm w-[90vw]"
          role="alert"
          aria-live="polite"
        >
          <div className="glass-dark border border-amber-500/30 rounded-2xl px-5 py-4 flex items-start gap-3 shadow-2xl shadow-black/60">
            {icons[type]}
            <p className="text-white/90 text-sm leading-relaxed flex-1">{message}</p>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white/80 transition-colors ml-auto shrink-0 mt-0.5"
              aria-label="Dismiss"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 4, ease: 'linear' }}
            style={{ transformOrigin: 'left' }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-b-2xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
