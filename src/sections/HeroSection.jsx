import { Suspense, useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCms } from '../data/cmsProvider';
import { HiArrowRight, HiOutlineCalendar } from 'react-icons/hi';
import { Link } from 'react-router-dom';

/* Lightweight floating shapes instead of Three.js for hero — better performance */
function HeroBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      {/* Purple orb */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '5%', left: '8%', width: '400px', height: '400px',
          borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15,
          background: 'radial-gradient(circle, #7c3aed, transparent)',
        }}
      />
      {/* Green orb */}
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '10%', right: '10%', width: '350px', height: '350px',
          borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1,
          background: 'radial-gradient(circle, #22c55e, transparent)',
        }}
      />
      {/* Blue orb */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '40%', right: '25%', width: '200px', height: '200px',
          borderRadius: '50%', filter: 'blur(80px)', opacity: 0.08,
          background: 'radial-gradient(circle, #38bdf8, transparent)',
        }}
      />
      {/* Grid pattern */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
    </div>
  );
}

export default function HeroSection() {
  const { heroData } = useCms();
  const sectionRef = useRef(null);

  // Removed complex 3D scroll logic

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '100px', /* Push content below navbar */
        paddingBottom: '60px',
      }}
    >
      <HeroBackground />

      <div className="section-container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.1fr 0.9fr',
          gap: '48px', alignItems: 'center',
        }} className="hero-grid">
          {/* Left: Text */}
          <div>
            {/* Badge — below navbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 20px', borderRadius: '999px',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                fontSize: '0.85rem', fontWeight: 500,
                color: 'var(--green-light)', marginBottom: '28px',
              }}
            >
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: 'var(--green)', animation: 'pulse-dot 2s ease-in-out infinite',
              }} />
              {heroData.badge}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
                marginBottom: '24px', fontFamily: 'var(--font-heading)',
              }}
            >
              {heroData.headline.split('High-Converting').map((part, i) =>
                i === 0 ? (
                  <span key={i}>{part}<span className="gradient-text">High-Converting</span></span>
                ) : (<span key={i}>{part}</span>)
              )}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                color: 'var(--text-secondary)', maxWidth: '480px',
                marginBottom: '36px', lineHeight: 1.7,
              }}
            >
              {heroData.subtext}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}
            >
              <a href="https://wa.me/917818832387?text=Hello%20team%20Net%20Nirman%2C%20I%20want%20to%20book%20an%20apointment" target="_blank" rel="noopener noreferrer" className="btn-green">
                {heroData.ctaPrimary} <HiArrowRight />
              </a>
              <Link to="/work" className="btn-secondary">
                <HiOutlineCalendar /> {heroData.ctaSecondary}
              </Link>
            </motion.div>
          </div>

          {/* Right: Motion Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="hero-mockup-wrapper"
            style={{ position: 'relative', zIndex: 10 }}
          >
            {/* Soft glow behind video */}
            <div style={{
              position: 'absolute', inset: '-20px', background: 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
              filter: 'blur(30px)', zIndex: -1
            }} />
            
            <video 
              src="/Video1.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              style={{ 
                width: '100%', 
                maxWidth: '600px',
                borderRadius: '16px', 
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)', 
                border: '2px solid rgba(255,255,255,0.05)',
                margin: '0 auto',
                display: 'block'
              }} 
            />
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          style={{
            marginTop: '60px', display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
          }}
          className="hero-stats-grid"
        >
          {heroData.stats.map((stat, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '16px 12px', borderRadius: '12px',
              background: 'rgba(124, 58, 237, 0.03)', border: '1px solid var(--border)',
            }}>
              <div className="gradient-text-purple" style={{
                fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '2px',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-mockup-wrapper { 
            margin-top: 40px; 
            transform: scale(0.9) !important; 
          }
          .hero-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
