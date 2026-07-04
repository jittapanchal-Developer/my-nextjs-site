'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ItemCard from '@/components/ItemCard';
import { menuItems, categories } from '@/data/menuItems';

/* ── Category emoji map ── */
const catIcons = {
  All: '🍽️',
  Burgers: '🍔',
  Pizza: '🍕',
  Momos: '🥟',
  Samosa: '🔺',
  Biryani: '🍛',
  'Rolls & Wraps': '🌯',
  Chinese: '🥡',
  Thali: '🍛',
  Pasta: '🍝',
  Sandwiches: '🥪',
  Desserts: '🍮',
  Beverages: '🥤',
  Salads: '🥗',
};

/* ── Short category labels for mobile ── */
const catLabels = {
  'Rolls & Wraps': 'Rolls',
};

/* ── Price range per category ── */
function getCategoryPriceRange(cat) {
  const items = cat === 'All'
    ? menuItems
    : menuItems.filter((i) => i.category === cat);
  if (!items.length) return '';
  const min = Math.min(...items.map((i) => i.price));
  const max = Math.max(...items.map((i) => i.price));
  return `₹${min} – ₹${max}`;
}

export default function MenuScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const tabsRef = useRef(null);
  const activeTabRef = useRef(null);
  const searchInputRef = useRef(null);

  /* ── Filter logic ── */
  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  /* ── Auto-scroll active tab into center ── */
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const tab = activeTabRef.current;
      const container = tabsRef.current;
      const tabLeft = tab.offsetLeft;
      const tabWidth = tab.offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: tabLeft - containerWidth / 2 + tabWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setSearchQuery('');
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  const clearAll = useCallback(() => {
    setActiveCategory('All');
    setSearchQuery('');
  }, []);

  /* ── Category item counts ── */
  const categoryCounts = useMemo(() => {
    const counts = {};
    categories.forEach((cat) => {
      counts[cat] =
        cat === 'All'
          ? menuItems.length
          : menuItems.filter((i) => i.category === cat).length;
    });
    return counts;
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d0d] pb-safe">
      <Navbar />

      {/* ── Hero Header ── */}
      <section className="relative pt-20 sm:pt-24 pb-4 overflow-hidden">
        {/* Ambient glows — GPU-composited */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[220px] bg-amber-600/8 rounded-full blur-3xl pointer-events-none will-change-transform" />
        <div className="absolute top-8 -left-16 w-36 h-36 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-8 -right-16 w-36 h-36 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-5"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.15em' }}
              animate={{ opacity: 1, letterSpacing: '0.25em' }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-amber-400 text-[10px] font-bold tracking-[0.25em] uppercase mb-1.5"
            >
              Our Offerings
            </motion.p>
            <h1
              className="font-bold text-3xl sm:text-5xl text-white mb-2 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              The{' '}
              <span className="gradient-text italic">Menu</span>
            </h1>
            <p className="text-white/35 text-xs sm:text-sm leading-relaxed max-w-[280px] sm:max-w-xs mx-auto">
              From street snacks to gourmet plates — crafted fresh, served with love.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="max-w-sm mx-auto mb-3"
          >
            <div
              className={`relative flex items-center rounded-xl transition-all duration-300 ${
                isSearchFocused
                  ? 'bg-white/8 border border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-white/5 border border-white/8'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className={`absolute left-3 w-4 h-4 pointer-events-none transition-colors duration-300 ${
                  isSearchFocused ? 'text-amber-400' : 'text-white/25'
                }`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                ref={searchInputRef}
                id="menu-search"
                type="text"
                placeholder="Search dishes, categories…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full bg-transparent pl-9 pr-9 py-2.5 text-white placeholder-white/20 text-sm outline-none"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/15 transition-all duration-200 active:scale-90"
                  aria-label="Clear search"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-2.5 h-2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky Category Tabs ── */}
      <div className="sticky top-[56px] sm:top-[60px] z-30 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5 py-2.5">
        <div
          ref={tabsRef}
          className="flex gap-2 overflow-x-auto px-3 no-scrollbar cat-tab-scroll"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const label = catLabels[cat] || cat;
            return (
              <button
                key={cat}
                ref={isActive ? activeTabRef : null}
                id={`category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleCategoryChange(cat)}
                className={`
                  relative flex-shrink-0 flex items-center gap-1.5
                  px-3 py-2 rounded-full text-xs font-medium
                  transition-all duration-300 cat-tab-item
                  active:scale-95
                  ${isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20'
                    : 'bg-white/5 text-white/45 hover:bg-white/8 hover:text-white/60'
                  }
                `}
              >
                <span className="text-sm leading-none">{catIcons[cat] || '🍴'}</span>
                <span className="leading-none whitespace-nowrap">{label}</span>
                <span
                  className={`text-[9px] font-bold leading-none ml-0.5 ${
                    isActive ? 'text-black/50' : 'text-white/20'
                  }`}
                >
                  {categoryCounts[cat]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results info bar ── */}
      <section className="max-w-7xl mx-auto px-4 pt-3.5 pb-1.5">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.2 }}
              className="text-white/25 text-[11px] flex items-center gap-1"
            >
              <span className="text-amber-400 font-semibold text-xs">{filtered.length}</span>
              {filtered.length === 1 ? 'item' : 'items'}
              {activeCategory !== 'All' && (
                <span className="text-white/15"> · {activeCategory}</span>
              )}
              {searchQuery && (
                <span className="text-white/15 truncate max-w-[120px]"> · "{searchQuery}"</span>
              )}
            </motion.p>
          </AnimatePresence>

          {(activeCategory !== 'All' || searchQuery) && (
            <button
              onClick={clearAll}
              className="text-amber-400/50 hover:text-amber-400 text-[11px] font-medium transition-colors active:scale-95"
            >
              Clear all
            </button>
          )}
        </div>
      </section>

      {/* ── Category Info Banner ── */}
      <AnimatePresence mode="wait">
        {activeCategory !== 'All' && (
          <motion.div
            key={`banner-${activeCategory}`}
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500/8 to-amber-600/3 border border-amber-500/10">
                <span className="text-xl">{catIcons[activeCategory] || '🍴'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-amber-400 font-semibold text-xs">{activeCategory}</p>
                  <p className="text-white/25 text-[10px]">
                    {filtered.length} options · {getCategoryPriceRange(activeCategory)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Item Grid / Empty ── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 pb-20">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4"
            >
              {filtered.map((item, i) => (
                <ItemCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-4xl mb-3"
              >
                🔍
              </motion.div>
              <p className="text-white/35 text-sm mb-1">No items found</p>
              <p className="text-white/18 text-xs mb-5">Try a different search or category</p>
              <button
                onClick={clearAll}
                className="bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-bold px-5 py-2.5 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 active:scale-95"
              >
                Show All Items
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Footer ── */}
      <div className="py-6 text-center border-t border-white/5">
        <Link
          href="/"
          className="text-white/20 hover:text-amber-400 text-xs transition-colors inline-flex items-center gap-1"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
