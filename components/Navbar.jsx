'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#hours', label: 'Hours' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-dark shadow-xl py-2.5 sm:py-3'
            : 'py-3.5 sm:py-5'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 group-active:scale-95">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5 text-espresso-900" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span
              className="font-display text-lg sm:text-xl font-semibold tracking-wide"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              <span className="gradient-text">Brûlé</span>
              <span className="text-white/80 ml-1">Café</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-amber-400 ${
                  pathname === link.href ? 'text-amber-400' : 'text-white/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/menu"
              className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-espresso-900 font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Menu
            </Link>

            {/* Mobile Menu CTA — visible only on mobile */}
            {pathname !== '/menu' && (
              <Link
                href="/menu"
                className="md:hidden text-[11px] font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-black px-3.5 py-1.5 rounded-full shadow-md shadow-amber-500/20 active:scale-95 transition-transform"
              >
                Menu
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Toggle menu"
            >
              <span className={`block h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? 'w-5 rotate-45 translate-y-[6.5px]' : 'w-5'}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0 w-0' : 'w-3.5'}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? 'w-5 -rotate-45 -translate-y-[6.5px]' : 'w-5'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-[52px] left-3 right-3 z-50 glass-dark rounded-2xl p-5 flex flex-col gap-3 md:hidden shadow-2xl"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-white/75 font-medium py-2 border-b border-white/8 hover:text-amber-400 transition-colors text-sm active:text-amber-400"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/menu"
                onClick={() => setMenuOpen(false)}
                className="mt-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-espresso-900 font-bold text-center py-2.5 rounded-xl text-sm active:scale-[0.98] transition-transform"
              >
                View Full Menu
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
