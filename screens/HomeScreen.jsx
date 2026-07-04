'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/Navbar';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=75&auto=format&fit=crop';

const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=75&auto=format&fit=crop',
    alt: 'Coffee art',
    span: 'md:col-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=600&q=75&auto=format&fit=crop',
    alt: 'Café interior',
    span: 'md:col-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=75&auto=format&fit=crop',
    alt: 'Pastries',
    span: 'md:col-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=75&auto=format&fit=crop',
    alt: 'Brunch plate',
    span: 'md:col-span-2',
  },
];

const HOURS = [
  { day: 'Monday – Friday', time: '7:00 AM – 9:00 PM' },
  { day: 'Saturday', time: '8:00 AM – 10:00 PM' },
  { day: 'Sunday', time: '9:00 AM – 7:00 PM' },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function HomeScreen() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="min-h-screen bg-[#0d0d0d] overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      >
        {/* Parallax background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE}
            alt="Brûlé Café hero"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/60 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-xs font-medium text-amber-400 tracking-widest uppercase"
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Now Open · Est. 2019
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="font-display text-6xl md:text-8xl font-bold leading-none mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            <span className="text-white">Where Every</span>
            <br />
            <span className="gradient-text italic">Sip Tells</span>
            <br />
            <span className="text-white">a Story.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Artisan coffee, gourmet plates, and handcrafted experiences —{' '}
            <span className="text-amber-400 font-medium">every visit</span> a memory
            worth savouring.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/menu"
              id="hero-menu-btn"
              className="group flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-8 py-4 rounded-full shadow-2xl shadow-amber-600/30 hover:scale-105 hover:shadow-amber-500/50 transition-all duration-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Explore Menu
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="#about"
              className="flex items-center gap-2 text-white/70 font-medium hover:text-white transition-colors group"
            >
              Our Story
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 group-hover:translate-y-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-0.5 h-8 bg-gradient-to-b from-amber-400/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-28 px-6 max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <motion.p variants={fadeUp} className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">
              Our Story
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Crafted with{' '}
              <span className="gradient-text italic">passion</span>,<br />
              served with love.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 leading-relaxed mb-4">
              Brûlé Café was born from a simple idea: that a great cup of coffee and a beautiful plate of food can transform an ordinary moment into something memorable.
            </motion.p>
            <motion.p variants={fadeUp} className="text-white/60 leading-relaxed mb-8">
              Our baristas source single-origin beans from sustainable farms, and our chefs craft each plate with the finest seasonal ingredients — delivering a dining experience that lingers long after the last bite.
            </motion.p>
            <motion.div variants={fadeUp} className="flex gap-10">
              {[['5★', 'Rating'], ['12K+', 'Happy Guests'], ['3', 'Locations']].map(([val, label]) => (
                <div key={label}>
                  <div className="gradient-text text-3xl font-bold">{val}</div>
                  <div className="text-white/40 text-sm mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Gallery grid */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 h-[420px]">
            {GALLERY.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl ${img.span} ${
                  i === 0 ? 'row-span-1' : i === 3 ? 'row-span-1' : ''
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="400px"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30" />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Hours & Location ── */}
      <section id="hours" className="py-20 px-6 bg-gradient-to-b from-transparent to-espresso-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Find Us</p>
            <h2
              className="font-display text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Hours & Location
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Hours card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-amber-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg">Opening Hours</h3>
              </div>
              <div className="space-y-4">
                {HOURS.map((h) => (
                  <div key={h.day} className="flex items-center justify-between py-3 border-b border-white/8">
                    <span className="text-white/60 text-sm">{h.day}</span>
                    <span className="text-amber-400 font-medium text-sm">{h.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Location card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-3xl p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-amber-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold text-lg">Visit Us</h3>
                </div>
                <p className="text-white/80 text-base leading-relaxed mb-2">
                  42 Artisan Row, <br />
                  SoHo District, New York, NY 10013
                </p>
                <p className="text-white/40 text-sm">Nearest subway: Spring St (C, E) · Canal St (1)</p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                id="get-directions-btn"
                className="mt-6 inline-flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 group"
              >
                Get Directions
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── What Makes Us Brûlé ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Our Craft</p>
            <h2
              className="font-display text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Why Brûlé?{' '}
              <span className="gradient-text italic">Because you deserve it.</span>
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                ),
                title: 'Single-Origin Beans',
                desc: 'Every cup starts with ethically sourced, freshly roasted beans from award-winning farms around the world.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                ),
                title: 'Chef-Curated Plates',
                desc: 'Our kitchen team creates dishes that balance bold flavour, seasonal freshness, and beautiful presentation.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                ),
                title: 'Warm Hospitality',
                desc: 'From the moment you walk in, our team is dedicated to making every visit feel like coming home.',
              },
            ].map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="glass rounded-3xl p-7 flex flex-col gap-4 hover:border-amber-500/20 transition-colors duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center group-hover:bg-amber-500/15 transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6 text-amber-400">
                    {icon}
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {title}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/menu"
              id="cta-menu-btn"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-8 py-4 rounded-full shadow-xl shadow-amber-600/25 hover:scale-105 hover:shadow-amber-500/40 transition-all duration-300 group"
            >
              Explore the Full Menu
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="gradient-text font-display font-semibold text-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
            Brûlé Café
          </span>
          <p className="text-white/30 text-sm">© 2025 Brûlé Café. All rights reserved.</p>
          <div className="flex gap-6">
            {['Instagram', 'Twitter', 'TikTok'].map((s) => (
              <a key={s} href="#" className="text-white/30 hover:text-amber-400 text-sm transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
