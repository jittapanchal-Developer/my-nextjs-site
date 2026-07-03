'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* ── Badge colour map ── */
const badgeColor = {
  Budget: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/15',
  Premium: 'bg-purple-500/20 text-purple-300 border-purple-500/15',
  Bestseller: 'bg-amber-500/20 text-amber-400 border-amber-500/15',
  Popular: 'bg-amber-500/20 text-amber-400 border-amber-500/15',
  Spicy: 'bg-red-500/20 text-red-400 border-red-500/15',
  Seasonal: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/15',
  Authentic: 'bg-orange-500/20 text-orange-400 border-orange-500/15',
  "Chef's Pick": 'bg-rose-500/20 text-rose-400 border-rose-500/15',
  Unique: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/15',
  'Kid-Friendly': 'bg-sky-500/20 text-sky-400 border-sky-500/15',
  'Street-Style': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/15',
  Fusion: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/15',
  Classic: 'bg-stone-500/20 text-stone-300 border-stone-500/15',
  Traditional: 'bg-amber-700/20 text-amber-300 border-amber-700/15',
  Light: 'bg-green-500/20 text-green-400 border-green-500/15',
};

const defaultBadge = 'bg-white/10 text-white/50 border-white/10';

export default function ItemCard({ item, index = 0 }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const badgeCls = item.badge
    ? badgeColor[item.badge] || defaultBadge
    : null;

  const isNonVeg = item.tags?.includes('non-veg');

  /* ── IntersectionObserver for staggered reveal ── */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger delay based on index within viewport
          const delay = (index % 4) * 60; // max 240ms stagger
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: '40px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="item-card-reveal"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.35s ease-out, transform 0.35s ease-out',
      }}
    >
      <Link
        href={`/menu/${item.id}`}
        className="group block relative"
        id={`item-${item.id}`}
      >
        <div className="item-card-wrapper relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] transition-all duration-300 active:scale-[0.97] sm:hover:border-amber-500/25 sm:hover:shadow-[0_12px_40px_-12px_rgba(180,83,9,0.2)] sm:hover:-translate-y-1">
          
          {/* ── Thumbnail ── */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={item.thumbnail}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out sm:group-hover:scale-105"
              loading={index < 4 ? 'eager' : 'lazy'}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

            {/* Badge */}
            {item.badge && (
              <div
                className={`absolute top-2 left-2 text-[9px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm border ${badgeCls}`}
              >
                {item.badge}
              </div>
            )}

            {/* Veg/Non-veg indicator */}
            <div className="absolute top-2 right-2">
              <div
                className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center ${
                  isNonVeg ? 'border-red-500' : 'border-green-500'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isNonVeg ? 'bg-red-500' : 'bg-green-500'
                  }`}
                />
              </div>
            </div>

            {/* Price overlay on mobile */}
            <div className="absolute bottom-1.5 right-1.5 sm:hidden">
              <span className="text-xs font-bold text-white bg-black/50 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                ₹{item.price}
              </span>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="p-2.5 sm:p-3.5">
            <h3
              className="text-white font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 sm:group-hover:text-amber-400 transition-colors duration-300 line-clamp-1"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {item.name}
            </h3>

            {/* Description — hidden on small mobile, 1 line on larger */}
            <p className="hidden sm:block text-white/35 text-[11px] line-clamp-2 leading-relaxed mb-2">
              {item.description}
            </p>

            {/* Mobile: compact row */}
            <div className="flex sm:hidden items-center justify-between mt-0.5">
              <span className="text-white/25 text-[10px] line-clamp-1 flex-1 mr-1">
                {item.description}
              </span>
            </div>

            {/* Desktop: Price row */}
            <div className="hidden sm:flex items-center justify-between mt-1">
              <span className="gradient-text font-bold text-sm">
                ₹{item.price}
              </span>
              <span className="text-[10px] text-white/25 flex items-center gap-0.5 sm:group-hover:text-amber-400/50 transition-colors">
                View
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-2.5 h-2.5 sm:group-hover:translate-x-0.5 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
