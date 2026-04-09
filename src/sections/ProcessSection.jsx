import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper, { SectionHeader } from '../components/SectionWrapper';
import { useCms } from '../data/cmsProvider';
import {
  HiOutlineChat, HiOutlineEye, HiOutlineClipboardCheck,
  HiOutlineCode, HiOutlineLightningBolt,
} from 'react-icons/hi';

const ICONS = {
  chat: HiOutlineChat,
  preview: HiOutlineEye,
  review: HiOutlineClipboardCheck,
  code: HiOutlineCode,
  rocket: HiOutlineLightningBolt,
};

function ProcessStep({ step, index, total }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const Icon = ICONS[step.icon];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      style={{ display: 'flex', gap: '24px', marginBottom: index < total - 1 ? '40px' : 0 }}
    >
      {/* Left: step node + connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div className="step-number">
          {Icon && <Icon />}
        </div>
        {index < total - 1 && (
          <motion.div
            initial={{ height: 0 }}
            animate={inView ? { height: '100%' } : {}}
            transition={{ delay: index * 0.12 + 0.3, duration: 0.5 }}
            style={{
              width: '2px', flex: 1, marginTop: '8px',
              background: 'linear-gradient(to bottom, rgba(124,58,237,0.25), transparent)',
            }}
          />
        )}
      </div>

      {/* Right: content */}
      <div className="glass-card" style={{ padding: '24px 28px', flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '8px',
        }}>
          <h3 style={{
            fontSize: '1.05rem', fontWeight: 600, fontFamily: 'var(--font-heading)',
          }}>
            <span style={{ color: 'var(--purple-light)', marginRight: '8px' }}>{step.number}.</span>
            {step.title}
          </h3>
          {step.duration && (
            <span style={{
              padding: '3px 10px', borderRadius: '6px',
              background: 'rgba(124,58,237,0.06)', border: '1px solid var(--border)',
              fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)',
            }}>
              {step.duration}
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
  const { processData } = useCms();
  const d = processData;

  return (
    <SectionWrapper id="process" animation="fadeLeft">
      <SectionHeader title={d.sectionTitle} subtitle={d.sectionSubtitle} badge="Simple Process" />
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {d.steps.map((step, i) => (
          <ProcessStep key={i} step={step} index={i} total={d.steps.length} />
        ))}
      </div>
    </SectionWrapper>
  );
}
