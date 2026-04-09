import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper, { SectionHeader } from '../components/SectionWrapper';
import { useCms } from '../data/cmsProvider';
import {
  HiOutlineEye, HiOutlineLightningBolt, HiOutlineChatAlt2,
  HiOutlineCurrencyDollar, HiOutlineTemplate, HiOutlineShieldCheck,
} from 'react-icons/hi';

const ICONS = {
  demo: HiOutlineEye,
  speed: HiOutlineLightningBolt,
  communication: HiOutlineChatAlt2,
  affordable: HiOutlineCurrencyDollar,
  custom: HiOutlineTemplate,
  support: HiOutlineShieldCheck,
};

const COLORS = ['#7c3aed', '#22c55e', '#38bdf8', '#a78bfa', '#4ade80', '#f59e0b'];

function TrustCard({ point, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const Icon = ICONS[point.icon];
  const color = COLORS[index % COLORS.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ scale: 1.04, y: -8 }}
      className="glass-card-glow"
      style={{ padding: '32px', cursor: 'default' }}
    >
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: `${color}12`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px', fontSize: '1.3rem', color,
        transition: 'all 0.3s',
      }}>
        {Icon && <Icon />}
      </div>
      <h3 style={{
        fontSize: '1.05rem', fontWeight: 600, marginBottom: '10px',
        fontFamily: 'var(--font-heading)',
      }}>
        {point.title}
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {point.description}
      </p>
    </motion.div>
  );
}

export default function TrustSection() {
  const { trustData } = useCms();
  const d = trustData;

  return (
    <SectionWrapper id="trust" animation="fadeRight">
      <SectionHeader title={d.sectionTitle} subtitle={d.sectionSubtitle} badge="Why Us" />
      <div className="responsive-grid-3">
        {d.points.map((point, i) => <TrustCard key={i} point={point} index={i} />)}
      </div>
    </SectionWrapper>
  );
}
