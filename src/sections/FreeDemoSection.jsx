import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper, { SectionHeader } from '../components/SectionWrapper';
import { useCms } from '../data/cmsProvider';
import { HiArrowRight, HiCheck } from 'react-icons/hi';

export default function FreeDemoSection() {
  const { freeDemoData } = useCms();
  const d = freeDemoData;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="free-demo" animation="zoomIn">
      <div
        ref={ref}
        style={{
          position: 'relative',
          padding: '64px 48px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(124,58,237,0.04))',
          border: '1px solid rgba(34,197,94,0.15)',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* Glow */}
        <div className="glow-orb glow-orb-green" style={{ top: '-100px', right: '-100px', width: '300px', height: '300px' }} />
        <div className="glow-orb glow-orb-purple" style={{ bottom: '-100px', left: '-100px', width: '300px', height: '300px' }} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            display: 'inline-flex', padding: '6px 16px', borderRadius: '999px',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
            fontSize: '0.8rem', fontWeight: 600, color: 'var(--green-light)',
            marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}
        >
          🎁 {d.sectionTitle}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 800, fontFamily: 'var(--font-heading)',
            marginBottom: '16px', lineHeight: 1.15,
          }}
        >
          {d.headline.split('FREE').map((part, i) =>
            i === 0 ? (
              <span key={i}>{part}<span className="gradient-text-green">FREE</span></span>
            ) : (<span key={i}>{part}</span>)
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: '1.05rem', color: 'var(--text-secondary)',
            maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.7,
          }}
        >
          {d.subtext}
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: '12px', marginBottom: '36px',
          }}
        >
          {d.features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '999px',
              background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)',
              fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)',
            }}>
              <HiCheck style={{ color: 'var(--green)', fontSize: '0.85rem' }} /> {f}
            </div>
          ))}
        </motion.div>

        <motion.a
          href={d.ctaLink}
          className="btn-green"
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
          style={{ fontSize: '1.05rem', padding: '18px 40px' }}
        >
          {d.ctaText} <HiArrowRight />
        </motion.a>
      </div>
    </SectionWrapper>
  );
}
