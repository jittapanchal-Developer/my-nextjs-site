'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ARViewer from '@/components/ARViewer';
import Toast from '@/components/Toast';

/**
 * ItemDetailScreen — shown at /menu/[id]
 * Props:
 *  - item: the menu item object from menuItems.js
 */
export default function ItemDetailScreen({ item }) {
  const [activeImage, setActiveImage] = useState(0);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [arSessionActive, setArSessionActive] = useState(false);
  const galleryRef = useRef(null);
  // Holds the function provided by ARViewer to imperatively trigger AR mode
  const activateARRef = useRef(null);

  // AR is ready when the item has a .glb model file
  const AR_READY = !!item.model;

  // menuItems only has a `thumbnail` — derive a gallery from it
  const images = item.images?.length ? item.images : [item.thumbnail];

  const showToast = useCallback((message, type = 'info') => {
    setToast({ visible: true, message, type });
  }, []);

  const handleARSessionStart = useCallback(() => {
    setArSessionActive(true);
    showToast('🥽 AR session started! Look around to place the dish on your table.', 'success');
  }, [showToast]);

  const handleARComingSoon = useCallback(() => {
    showToast('🥽 3D AR Model coming soon! Check back later to view this dish on your table.', 'info');
  }, [showToast]);

  // Called by ARViewer once the model-viewer element is ready;
  // stores the trigger so the "View on Table" button can fire it.
  const handleActivateAR = useCallback((triggerFn) => {
    activateARRef.current = triggerFn;
  }, []);

  const handleViewOnTable = useCallback(() => {
    if (activateARRef.current) {
      activateARRef.current();
    }
  }, []);

  const scrollToImage = useCallback((index) => {
    setActiveImage(index);
    const el = galleryRef.current?.children[index];
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-white/30 mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/menu" className="hover:text-amber-400 transition-colors">Menu</Link>
          <span>/</span>
          <span className="text-white/60 truncate">{item.name}</span>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* ── Left: Image Gallery ── */}
          <div>
            {/* Main active image */}
            <motion.div
              layout
              className="relative w-full h-80 md:h-[480px] rounded-3xl overflow-hidden mb-4 shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[activeImage]}
                    alt={`${item.name} — view ${activeImage + 1}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Image counter */}
              <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5 text-xs font-medium text-white/80">
                {activeImage + 1} / {images.length}
              </div>

              {/* Badge */}
              {item.badge && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {item.badge}
                </div>
              )}

              {/* AR badge — shown on photos when model is ready */}
              {AR_READY && (
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-amber-500/40 rounded-full px-3 py-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  <span className="text-amber-400 text-[10px] font-semibold tracking-wide uppercase">AR Ready</span>
                </div>
              )}

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    id="gallery-prev"
                    onClick={() => scrollToImage((activeImage - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="Previous image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    id="gallery-next"
                    onClick={() => scrollToImage((activeImage + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="Next image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </motion.div>

            {/* Horizontal thumbnail strip */}
            <div
              ref={galleryRef}
              className="gallery-scroll flex gap-3 overflow-x-auto pb-1"
            >
              {images.map((src, i) => (
                <button
                  key={i}
                  id={`thumb-${i}`}
                  onClick={() => scrollToImage(i)}
                  className={`gallery-item relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImage === i
                      ? 'border-amber-500 shadow-lg shadow-amber-500/30 scale-105'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${item.name} thumbnail ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  {activeImage !== i && (
                    <div className="absolute inset-0 bg-black/30" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Details + AR ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col"
          >
            {/* Category */}
            <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3">
              {item.category}
            </span>

            {/* Name */}
            <h1
              className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {item.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="gradient-text text-4xl font-bold">
                ₹{item.price}
              </span>
              <span className="text-white/30 text-sm line-through">
                ₹{Math.round(item.price * 1.2)}
              </span>
            </div>

            {/* Divider */}
            <div className="line-accent mb-6" />

            {/* Description */}
            <p className="text-white/70 leading-relaxed text-base mb-8">
              {item.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['Freshly Made', 'Premium Ingredients', 'Chef Curated'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* ── AR Preview Panel ── */}
            <div className="glass rounded-3xl p-5 mb-8">
              {/* Panel header */}
              <div className="flex items-center gap-2 mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-amber-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
                <span className="text-white font-semibold text-sm">3D AR Preview</span>

                {AR_READY ? (
                  <span className="ml-auto flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Live
                  </span>
                ) : (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 font-medium tracking-wide">
                    Coming Soon
                  </span>
                )}
              </div>

              {/* model-viewer container */}
              <div className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${AR_READY ? 'h-64' : 'h-48'}`}>
                <ARViewer
                  glbSrc={item.model}
                  usdzSrc={item.modelIos}
                  poster={item.thumbnail}
                  label={`3D model of ${item.name}`}
                  isReady={AR_READY}
                  onARSessionStart={handleARSessionStart}
                  onActivateAR={handleActivateAR}
                />
              </div>

              {AR_READY ? (
                <div className="flex items-start gap-2 mt-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <p className="text-white/30 text-xs leading-relaxed">
                    Drag to rotate · Pinch to zoom · Tap <strong className="text-amber-400">View in AR</strong> to place on your table
                  </p>
                </div>
              ) : (
                <p className="text-white/30 text-xs mt-3 text-center">
                  3D model files will be loaded automatically once available.
                </p>
              )}
            </div>

            {/* ── View on Table CTA ── */}
            <motion.button
              id="view-on-table-btn"
              whileTap={{ scale: 0.97 }}
              onClick={AR_READY ? handleViewOnTable : handleARComingSoon}
              disabled={!AR_READY}
              aria-disabled={!AR_READY}
              className={`
                relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base
                transition-all duration-300 overflow-hidden group
                ${
                  AR_READY
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-2xl ar-btn-glow hover:scale-[1.02] cursor-pointer'
                    : 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400/60 border border-amber-500/25 cursor-not-allowed'
                }
              `}
            >
              {/* Shimmer sweep on hover (active only) */}
              {AR_READY && (
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              )}

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              <span className="relative z-10">
                {AR_READY ? '✨ View on Your Table' : 'View on Table — Coming Soon'}
              </span>
              {!AR_READY && (
                <span className="relative z-10 ml-1 text-xs font-normal opacity-60">(3D model pending)</span>
              )}
            </motion.button>

            {/* Device support note */}
            {AR_READY && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-white/20 text-[10px] mt-3 flex items-center justify-center gap-3"
              >
                <span>📱 Android via WebXR / Scene Viewer</span>
                <span>·</span>
                <span>🍎 iOS via Quick Look</span>
              </motion.p>
            )}

            {/* Back to menu */}
            <Link
              href="/menu"
              className="mt-5 text-center text-white/30 hover:text-amber-400 text-sm transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Menu
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Toast notification */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
        type={toast.type}
      />
    </main>
  );
}
