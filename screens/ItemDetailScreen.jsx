'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

/* ── Highlight pills shown in the detail card ── */
const HIGHLIGHTS = ['Freshly Made', 'Premium Ingredients', 'Chef Curated', 'Made to Order'];

/* ── Veg / Non-veg icon ── */
function DietBadge({ isNonVeg }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full border ${
        isNonVeg
          ? 'bg-red-500/10 text-red-400 border-red-500/25'
          : 'bg-green-500/10 text-green-400 border-green-500/25'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${isNonVeg ? 'bg-red-500' : 'bg-green-500'}`}
      />
      {isNonVeg ? 'Non-Vegetarian' : 'Vegetarian'}
    </div>
  );
}

/**
 * ItemDetailScreen — shown at /menu/[id]
 * Props:
 *  - item: the menu item object from menuItems.js
 */
export default function ItemDetailScreen({ item }) {
  const [activeImage, setActiveImage] = useState(0);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [addedToFav, setAddedToFav] = useState(false);
  const galleryRef = useRef(null);

  // menuItems only has a `thumbnail` — derive a gallery from it
  const images = item.images?.length ? item.images : [item.thumbnail];

  const isNonVeg = item.tags?.includes('non-veg');

  const showToast = useCallback((message, type = 'info') => {
    setToast({ visible: true, message, type });
  }, []);

  const handleFavourite = useCallback(() => {
    setAddedToFav((prev) => !prev);
    showToast(
      addedToFav ? 'Removed from favourites.' : '❤️ Added to favourites!',
      addedToFav ? 'info' : 'success'
    );
  }, [addedToFav, showToast]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: item.name, text: item.description, url: window.location.href });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Link copied to clipboard!', 'success');
    }
  }, [item, showToast]);

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
          transition={{ duration: 0.4 }}
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
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main active image */}
            <div className="relative w-full h-80 md:h-[480px] rounded-3xl overflow-hidden mb-4 shadow-2xl shadow-black/60">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
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

              {/* Share + favourite controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  id="share-btn"
                  onClick={handleShare}
                  aria-label="Share this item"
                  className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button
                  id="favourite-btn"
                  onClick={handleFavourite}
                  aria-label={addedToFav ? 'Remove from favourites' : 'Add to favourites'}
                  className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all duration-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={addedToFav ? '#f59e0b' : 'none'}
                    stroke={addedToFav ? '#f59e0b' : 'currentColor'}
                    strokeWidth={2}
                    className="w-4 h-4 transition-colors duration-200"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    id="gallery-prev"
                    onClick={() => scrollToImage((activeImage - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
                    aria-label="Previous image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    id="gallery-next"
                    onClick={() => scrollToImage((activeImage + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
                    aria-label="Next image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

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
          </motion.div>

          {/* ── Right: Details ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            {/* Category + Diet */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
                {item.category}
              </span>
              <span className="text-white/15">·</span>
              <DietBadge isNonVeg={isNonVeg} />
            </div>

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
              <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Save ₹{Math.round(item.price * 0.2)}
              </span>
            </div>

            {/* Divider */}
            <div className="line-accent mb-6" />

            {/* Description */}
            <p className="text-white/70 leading-relaxed text-base mb-8">
              {item.description}
            </p>

            {/* Highlight tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {HIGHLIGHTS.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                  {tag}
                </span>
              ))}
            </div>

            {/* ── Dish Details Card ── */}
            <div className="glass rounded-3xl p-5 mb-8">
              {/* Card header */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4.5 h-4.5 text-amber-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-white font-semibold text-sm">Dish Details</span>
              </div>

              {/* Detail rows */}
              <div className="space-y-3.5">
                {[
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ),
                    label: 'Prep Time',
                    value: '15 – 25 min',
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                    ),
                    label: 'Served',
                    value: 'Hot & Fresh',
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ),
                    label: 'Availability',
                    value: 'Available Now',
                    highlight: true,
                  },
                ].map(({ icon, label, value, highlight }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-white/30 flex-shrink-0">
                        {icon}
                      </svg>
                      <span className="text-white/45 text-sm">{label}</span>
                    </div>
                    <span className={`text-sm font-medium ${highlight ? 'text-emerald-400' : 'text-white/80'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Primary CTA — Order Now ── */}
            <motion.a
              id="order-now-btn"
              href={`tel:+1234567890`}
              whileTap={{ scale: 0.97 }}
              className="relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-2xl shadow-amber-600/25 hover:scale-[1.02] hover:shadow-amber-500/40 transition-all duration-300 overflow-hidden group mb-3 cursor-pointer"
            >
              {/* Shimmer sweep on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="relative z-10">Call to Order</span>
            </motion.a>

            {/* Secondary CTA — Favourite */}
            <motion.button
              id="add-favourite-btn"
              whileTap={{ scale: 0.97 }}
              onClick={handleFavourite}
              className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-sm border transition-all duration-300 ${
                addedToFav
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-white/[0.04] border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill={addedToFav ? '#f59e0b' : 'none'}
                stroke={addedToFav ? '#f59e0b' : 'currentColor'}
                strokeWidth={2}
                className="w-4 h-4 transition-colors duration-200"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {addedToFav ? 'Saved to Favourites' : 'Save to Favourites'}
            </motion.button>

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
