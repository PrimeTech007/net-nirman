import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/* ─── Animation variants per section for unique feel ─── */
const animationVariants = {
  fadeUp: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
  fadeLeft: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  fadeRight: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  zoomIn: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  slideUp: { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } },
};

export default function SectionWrapper({
  children,
  id,
  className = '',
  animation = 'fadeUp',
  delay = 0,
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const variant = animationVariants[animation] || animationVariants.fadeUp;

  return (
    <section id={id} className={`section-padding ${className}`} ref={ref}>
      <motion.div
        className="section-container"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={variant}
        transition={{
          duration: 0.75,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </section>
  );
}

export function SectionHeader({ title, subtitle, center = true, badge }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: '64px' }}>
      {badge && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(124, 58, 237, 0.08)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--purple-light)',
          marginBottom: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {badge}
        </div>
      )}
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle" style={center ? { margin: '0 auto' } : {}}>
        {subtitle}
      </p>
    </div>
  );
}
