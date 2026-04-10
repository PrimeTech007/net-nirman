import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper, { SectionHeader } from '../components/SectionWrapper';
import { useCms } from '../data/cmsProvider';

export default function AboutSection() {
  const { aboutData } = useCms();
  const d = aboutData;
  const containerRef = useRef(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Simple transition without scroll progress dependency

  return (
    <SectionWrapper id="about" className="grid-bg" animation="fadeLeft">
      <SectionHeader title={d.sectionTitle} subtitle="" />

      <div ref={containerRef} style={{
        display: 'grid', gridTemplateColumns: '1.2fr 0.8fr',
        gap: '60px', alignItems: 'center', position: 'relative'
      }} className="about-grid">
        
        {/* Left Column (Content + Stats) */}
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h3 className="gradient-text" style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700,
              marginBottom: '24px', fontFamily: 'var(--font-heading)', lineHeight: 1.2,
            }}>
              {d.heading}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {d.paragraphs.map((p, i) => (
                <motion.p key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Stats moved UNDER the text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ 
              display: 'grid', gridTemplateColumns: '1fr 1fr', 
              gap: '20px'
            }}
          >
            {d.stats.map((stat, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-card"
                style={{ padding: '24px 20px', textAlign: 'center', cursor: 'default' }}
              >
                <div className="gradient-text-purple" style={{
                  fontSize: '1.8rem', fontWeight: 800,
                  fontFamily: 'var(--font-heading)', marginBottom: '4px',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Scrolling Image */}
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Ambient Glow behind image */}
          <div style={{
            position: 'absolute', width: '300px', height: '300px',
            background: 'var(--purple)', opacity: 0.15, filter: 'blur(100px)',
            borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
          }} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            style={{
              zIndex: 10,
              width: '100%',
              maxWidth: '380px', // Adjusted size to fit elegantly next to text
            }}
          >
            <div style={{ position: 'relative' }}>
              {/* Backing accent card */}
              <div style={{
                position: 'absolute', inset: 0, background: 'linear-gradient(45deg, var(--purple), var(--green))',
                borderRadius: '24px', transform: 'rotate(-3deg) scale(1.02)', zIndex: -1, opacity: 0.5
              }} />
              
              <img 
                src="/founder.png" 
                alt="Founder"
                style={{ 
                  width: '100%', height: 'auto', borderRadius: '24px', 
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  position: 'relative', zIndex: 1,
                  background: 'var(--bg-secondary)', // Fallback if transparent png
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback box if image isn't uploaded yet */}
              <div style={{
                display: 'none', width: '100%', aspectRatio: '4/5', 
                background: 'rgba(255,255,255,0.05)', borderRadius: '24px',
                border: '1px dashed var(--border)', alignItems: 'center', 
                justifyContent: 'center', textAlign: 'center', padding: '20px',
                color: 'var(--text-muted)', fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '2rem' }}>🖼️</span>
                  Place your image in<br/><code style={{ color: 'var(--purple-light)', background: 'rgba(124,58,237,0.1)', padding: '4px 8px', borderRadius: '4px' }}>public/founder.png</code>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 60px !important; }
        }
      `}</style>
    </SectionWrapper>
  );
}
