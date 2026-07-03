'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ARViewer — wraps Google <model-viewer> web component.
 *
 * Props:
 *  - glbSrc:    path/URL to the .glb 3D model
 *  - usdzSrc:   path/URL to the .usdz model for iOS Quick Look
 *  - poster:    image shown while model loads (falls back to item thumbnail)
 *  - label:     aria-label for the viewer
 *  - isReady:   boolean — true when model files exist
 *  - onARSessionStart: callback fired when AR session begins
 *  - onActivateAR:     ref callback to imperatively trigger AR mode
 */
export default function ARViewer({
  glbSrc,
  usdzSrc,
  poster,
  label,
  isReady = false,
  onARSessionStart,
  onActivateAR,       // called with a trigger fn so parent can launch AR
}) {
  const modelRef = useRef(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadState, setLoadState] = useState('idle'); // idle | loading | loaded | error
  const [arStatus, setArStatus] = useState('not-presenting'); // not-presenting | session-started | object-placed | failed
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  /* ── Load model-viewer script only when AR is ready ── */
  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return;

    if (document.querySelector('script[data-mv]')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src =
      'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    script.setAttribute('data-mv', 'true');
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, [isReady]);

  /* ── Expose AR trigger to parent after script + model load ── */
  useEffect(() => {
    if (!onActivateAR) return;
    // Provide a function the parent ("View on Table" btn) can call
    onActivateAR(() => {
      const mv = modelRef.current;
      if (mv && typeof mv.activateAR === 'function') {
        mv.activateAR();
      }
    });
  }, [onActivateAR, scriptLoaded]);

  /* ── Wire model-viewer events after script loads ── */
  useEffect(() => {
    if (!scriptLoaded || !modelRef.current) return;

    const mv = modelRef.current;

    const onProgress = (e) => {
      const pct = Math.round(e.detail.totalProgress * 100);
      setLoadProgress(pct);
      if (loadState !== 'loading') setLoadState('loading');
    };

    const onLoad = () => {
      setLoadState('loaded');
      setLoadProgress(100);
    };

    const onError = () => setLoadState('error');

    const onARStatus = (e) => {
      setArStatus(e.detail.status);
      if (e.detail.status === 'session-started' && onARSessionStart) onARSessionStart();
    };

    mv.addEventListener('progress', onProgress);
    mv.addEventListener('load', onLoad);
    mv.addEventListener('error', onError);
    mv.addEventListener('ar-status', onARStatus);

    return () => {
      mv.removeEventListener('progress', onProgress);
      mv.removeEventListener('load', onLoad);
      mv.removeEventListener('error', onError);
      mv.removeEventListener('ar-status', onARStatus);
    };
  }, [scriptLoaded, onARSessionStart, loadState]);

  const handleRetry = useCallback(() => {
    setLoadState('idle');
    setLoadProgress(0);
    if (modelRef.current) {
      const src = modelRef.current.src;
      modelRef.current.src = '';
      setTimeout(() => { if (modelRef.current) modelRef.current.src = src; }, 50);
    }
  }, []);

  /* ─────────────────────────────────────────────────────────────
     PLACEHOLDER — model not ready yet
  ───────────────────────────────────────────────────────────── */
  if (!isReady) {
    return (
      <div className="w-full h-full relative flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a0f0a] to-[#0d0d0d] border border-white/8">
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Floating cube icon */}
        <motion.div
          animate={{ y: [0, -10, 0], rotateY: [0, 15, 0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-4"
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-full blur-xl bg-amber-500/20 scale-150" />
          <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 relative" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cubeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <path d="M32 6L58 20V44L32 58L6 44V20L32 6Z" stroke="url(#cubeGrad)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
            <path d="M32 6V58" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4"/>
            <path d="M6 20L58 20" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4"/>
            <path d="M6 44L58 44" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4"/>
            <circle cx="32" cy="32" r="4" fill="#f59e0b" opacity="0.9"/>
          </svg>
        </motion.div>

        <p className="text-amber-400 font-semibold text-sm mb-1">3D Model Coming Soon</p>
        <p className="text-white/30 text-xs text-center px-6 max-w-[200px]">
          AR preview will be available once the 3D model is ready.
        </p>

        {/* Scanning line animation */}
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
          className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none"
        />
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     ACTIVE AR VIEWER
  ───────────────────────────────────────────────────────────── */
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl transition-all duration-500 ${
        isFullscreen ? 'h-[480px]' : 'h-full'
      }`}
      style={{ background: '#0d0d0d' }}
    >
      {/* model-viewer — the actual 3D engine
          scale="fixed"        → model stays constant real-world size regardless of camera distance
          ar-scale="fixed"     → disable automatic rescaling during AR placement
          xr-environment       → makes the AR background transparent (no flat shadow plane)
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <model-viewer
        ref={modelRef}
        src={glbSrc}
        ios-src={usdzSrc || undefined}
        poster={poster || undefined}
        alt={label}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        scale="1 1 1"
        camera-controls
        auto-rotate
        auto-rotate-delay="1000"
        rotation-per-second="15deg"
        shadow-intensity="1"
        shadow-softness="1"
        exposure="1.1"
        environment-image="neutral"
        touch-action="pan-y"
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          '--poster-color': 'transparent',
        }}
      >
        {/* Custom AR launch button (hidden — parent "View on Table" btn calls activateAR()) */}
        <button
          slot="ar-button"
          id="ar-launch-btn"
          aria-label="View in AR"
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(to right, #f59e0b, #d97706)',
            color: '#000',
            fontSize: '12px',
            fontWeight: '700',
            padding: '6px 14px',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: '14px', height: '14px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          View in AR
        </button>
      </model-viewer>

      {/* ── Loading overlay ── */}
      <AnimatePresence>
        {loadState === 'loading' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d0d]/90 backdrop-blur-sm rounded-2xl z-10"
          >
            {/* Spinning ring */}
            <div className="relative w-14 h-14 mb-4">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
                <circle
                  cx="28" cy="28" r="24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - loadProgress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-amber-400 text-xs font-bold">
                {loadProgress}%
              </span>
            </div>
            <p className="text-white/60 text-xs">Loading 3D Model…</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error state ── */}
      <AnimatePresence>
        {loadState === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d0d]/95 rounded-2xl z-10 gap-3"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth={2} className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-white/50 text-xs text-center px-4">Failed to load 3D model</p>
            <button
              onClick={handleRetry}
              className="text-amber-400 text-xs font-medium border border-amber-500/30 px-4 py-1.5 rounded-full hover:bg-amber-500/10 transition-colors active:scale-95"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AR status indicator ── */}
      <AnimatePresence>
        {arStatus === 'session-started' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-amber-500/30 px-4 py-1.5 rounded-full z-20"
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-amber-400 text-xs font-medium">AR Active</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Controls overlay (shown when loaded) ── */}
      {loadState === 'loaded' && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {/* Fullscreen toggle */}
          <button
            id="ar-fullscreen-btn"
            onClick={() => setIsFullscreen(f => !f)}
            title={isFullscreen ? 'Collapse' : 'Expand'}
            className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/80 transition-all active:scale-90"
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </button>

          {/* Interaction hint */}
          <div className="bg-black/60 backdrop-blur-sm border border-white/8 rounded-lg px-2 py-1 text-[9px] text-white/30 whitespace-nowrap">
            Drag to rotate
          </div>
        </div>
      )}
    </div>
  );
}
