import { Suspense, useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCms } from '../data/cmsProvider';
import { HiArrowRight, HiOutlineCalendar } from 'react-icons/hi';

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

  /* Scroll-based 3D parallax for laptop */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  
  // Straight on arrival (0 degrees). Spins dramatically 180 degrees backwards on scroll
  const laptopY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const laptopScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const laptopRotateY = useTransform(scrollYProgress, [0, 0.8], [0, 180]); // The 180 deg spin
  const laptopRotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);    // Slight tilt upwards on twist
  const laptopRotateZ = useTransform(scrollYProgress, [0, 1], [0, 0]);     // Keep level

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
              <a href={heroData.ctaPrimaryLink} className="btn-green">
                {heroData.ctaPrimary} <HiArrowRight />
              </a>
              <a href={heroData.ctaSecondaryLink} className="btn-secondary">
                <HiOutlineCalendar /> {heroData.ctaSecondary}
              </a>
            </motion.div>
          </div>

          {/* Right: Laptop Mockup (3D animated and responsive) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
            style={{ 
              y: laptopY, 
              scale: laptopScale, 
              rotateX: laptopRotateX, 
              rotateY: laptopRotateY, 
              rotateZ: laptopRotateZ,
              perspective: 2000,
              transformStyle: 'preserve-3d',
              zIndex: 10
            }}
            className="hero-mockup-wrapper"
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: '560px', margin: '0 auto', transformStyle: 'preserve-3d' }}>
              {/* Soft glow behind laptop */}
              <div style={{
                position: 'absolute', inset: '-20px', background: 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
                filter: 'blur(30px)', zIndex: -1, transform: 'translateZ(-50px)'
              }} />

              {/* 💻 FRONT FACE: Laptop Screen Body */}
              <div style={{
                position: 'relative', borderRadius: '16px', border: '2px solid rgba(255,255,255,0.05)',
                background: '#040710', aspectRatio: '16/10', overflow: 'hidden', padding: '4px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
                borderBottom: '4px solid #1f2937', transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden', zIndex: 2
              }}>
                {/* Screen Display Area */}
                <div style={{
                  width: '100%', height: '100%', background: '#0d1117', borderRadius: '10px',
                  display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
                  border: '1px solid #111'
                }}>
                  
                  {/* MacOS Window Controls */}
                  <div style={{ display: 'flex', gap: '6px', padding: '12px 14px', background: '#161b22', borderBottom: '1px solid #30363d' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                    <div style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', color: '#8b949e', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                      App.jsx — Net Nirman
                    </div>
                  </div>

                  {/* Animated Code Typing Area */}
                  <div style={{ padding: '16px 20px', fontFamily: '"Fira Code", monospace', fontSize: '0.8rem', lineHeight: 1.6, color: '#c9d1d9', flex: 1 }}>
                    <div><span style={{ color: '#ff7b72' }}>import</span> {'{'} <span style={{ color: '#d2a8ff' }}>Growth</span>, <span style={{ color: '#d2a8ff' }}>Success</span> {'}'} <span style={{ color: '#ff7b72' }}>from</span> <span style={{ color: '#a5d6ff' }}>"net-nirman"</span>;</div>
                    <div style={{ marginTop: '12px' }}><span style={{ color: '#ff7b72' }}>export default function</span> <span style={{ color: '#d2a8ff' }}>Website</span>() {'{'}</div>
                    <div style={{ paddingLeft: '20px' }}>
                      <span style={{ color: '#ff7b72' }}>return</span> (
                      <div style={{ paddingLeft: '20px', color: '#79c0ff' }}>
                        {'<agency>'}
                      </div>
                      <div style={{ paddingLeft: '40px' }}>
                        {'<'}span style={'{'}color: <span style={{ color: '#a5d6ff' }}>'premium'</span>{'}'}{'>'}<br />
                        <motion.span 
                          initial={{ width: 0, borderRight: '2px solid white' }}
                          animate={{ width: '100%', borderRight: '0px solid white' }}
                          transition={{ duration: 2, ease: "linear", repeat: Infinity, repeatType: 'reverse' }}
                          style={{ color: '#a5d6ff', display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', verticalAlign: 'bottom' }}
                        >
                          "High-Converting Portfolios"
                        </motion.span>
                        <br/>{'</'}span{'>'}
                        <div style={{ color: '#79c0ff' }}>{'<FastLoad />'}</div>
                      </div>
                      <div style={{ paddingLeft: '20px', color: '#79c0ff' }}>
                        {'</agency>'}
                      </div>
                      );
                    </div>
                    <div>{'}'}</div>
                    
                    {/* Floating Pulse Graphic inside screen */}
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '10px 16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#4ade80', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse-dot 1.5s infinite' }} />
                      Deploying...
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* 💻 BACK FACE: Laptop Cover with N Logo */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                aspectRatio: '16/10', borderRadius: '16px',
                background: 'linear-gradient(135deg, #1f2937, #111827)',
                border: '2px solid rgba(255,255,255,0.05)',
                transform: 'rotateY(180deg) translateZ(1px)', 
                backfaceVisibility: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)', zIndex: 1
              }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, var(--purple), var(--green))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '2.5rem', fontWeight: 800,
                  boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
                  fontFamily: 'var(--font-heading)'
                }}>N</div>
              </div>

              {/* Laptop Keyboard Base (Translates uniformly below) */}
              <div style={{
                position: 'relative', width: '114%', height: '18px', left: '-7%', marginTop: '-2px',
                background: 'linear-gradient(180deg, #374151 0%, #111827 100%)', borderTop: '2px solid #4b5563',
                borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 1px 3px rgba(255,255,255,0.2)',
                transform: 'translateZ(10px)', transformStyle: 'preserve-3d'
              }}>
                {/* Thumb scoop */}
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '60px', height: '6px', background: '#1f2937',
                  borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                  backfaceVisibility: 'hidden'
                }} />
              </div>

            </div>
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
