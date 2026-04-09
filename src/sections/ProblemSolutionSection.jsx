import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper, { SectionHeader } from '../components/SectionWrapper';
import { useCms } from '../data/cmsProvider';
import {
  HiOutlineBan, HiOutlineClock, HiOutlineEmojiSad, HiOutlineExclamation,
  HiOutlineLightningBolt, HiOutlineTrendingUp, HiOutlineDeviceTablet, HiOutlineSearch,
} from 'react-icons/hi';

const PROBLEM_ICONS = {
  noWebsite: HiOutlineBan,
  slowSite: HiOutlineClock,
  uglyDesign: HiOutlineEmojiSad,
  noLeads: HiOutlineExclamation,
};
const SOLUTION_ICONS = {
  lightning: HiOutlineLightningBolt,
  conversion: HiOutlineTrendingUp,
  mobile: HiOutlineDeviceTablet,
  seo: HiOutlineSearch,
};

function Card({ item, index, type }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const isProblem = type === 'problem';
  const Icon = isProblem ? PROBLEM_ICONS[item.icon] : SOLUTION_ICONS[item.icon];
  const color = isProblem ? 'var(--red)' : 'var(--green)';
  const bg = isProblem ? 'rgba(248,113,113,0.08)' : 'rgba(34,197,94,0.08)';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass-card-glow"
      style={{ padding: '32px' }}
    >
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px', fontSize: '1.3rem', color,
      }}>
        {Icon && <Icon />}
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
        {item.title}
      </h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {item.description}
      </p>
      {/* Show business benefit for solutions */}
      {item.benefit && (
        <div style={{
          marginTop: '16px', padding: '8px 14px', borderRadius: '8px',
          background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)',
          fontSize: '0.8rem', fontWeight: 600, color: 'var(--green-light)',
        }}>
          → {item.benefit}
        </div>
      )}
    </motion.div>
  );
}

export default function ProblemSolutionSection() {
  const { problemSolutionData } = useCms();
  const d = problemSolutionData;

  return (
    <SectionWrapper id="problem-solution" className="grid-bg" animation="slideUp">
      <SectionHeader title={d.sectionTitle} subtitle={d.sectionSubtitle} />

      {/* Problems */}
      <div style={{ marginBottom: '80px' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
            fontSize: '0.8rem', fontWeight: 600, color: 'var(--red)',
            marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.05em',
          }}
        >
          ✕ Common Business Problems
        </motion.div>
        <div className="responsive-grid-2">
          {d.problems.map((p, i) => <Card key={i} item={p} index={i} type="problem" />)}
        </div>
      </div>

      {/* Transition */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}
      >
        <div style={{
          padding: '12px 32px', borderRadius: '999px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(34,197,94,0.08))',
          border: '1px solid rgba(124,58,237,0.2)',
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem',
        }}>
          ↓ {d.solutionTitle}
        </div>
      </motion.div>

      {/* Solutions */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
            fontSize: '0.8rem', fontWeight: 600, color: 'var(--green)',
            marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.05em',
          }}
        >
          ✓ How I Fix This
        </motion.div>
        <div className="responsive-grid-2">
          {d.solutions.map((s, i) => <Card key={i} item={s} index={i} type="solution" />)}
        </div>
      </div>
    </SectionWrapper>
  );
}
