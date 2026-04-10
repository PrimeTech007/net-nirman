import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper, { SectionHeader } from '../components/SectionWrapper';
import { useCms } from '../data/cmsProvider';
import { HiCheck, HiArrowRight } from 'react-icons/hi';

function PricingCard({ plan, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      className={`glass-card-glow ${plan.highlighted ? 'pricing-highlighted' : ''}`}
      style={{
        padding: '40px 32px', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {plan.badge && (
        <div style={{
          position: 'absolute', top: '20px', right: '20px',
          padding: '4px 14px', borderRadius: '999px',
          background: 'linear-gradient(135deg, var(--purple), var(--green))',
          fontSize: '0.68rem', fontWeight: 700, color: 'white',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {plan.badge}
        </div>
      )}

      {plan.highlighted && (
        <div className="glow-orb glow-orb-purple" style={{
          top: '-80px', right: '-80px', width: '200px', height: '200px',
        }} />
      )}

      <h3 style={{
        fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)',
        marginBottom: '8px', fontFamily: 'var(--font-heading)',
      }}>
        {plan.name}
      </h3>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
        <span style={{
          fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.02em',
        }} className={plan.highlighted ? 'gradient-text-purple' : ''}>
          {plan.price}
        </span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/{plan.period}</span>
      </div>

      <p style={{
        fontSize: '0.85rem', color: 'var(--text-secondary)',
        marginBottom: '28px', lineHeight: 1.6,
      }}>
        {plan.description}
      </p>

      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '28px' }} />

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '14px',
        flex: 1, marginBottom: '32px',
      }}>
        {plan?.features?.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            fontSize: '0.88rem', color: 'var(--text-secondary)',
          }}>
            <HiCheck style={{
              color: plan?.highlighted ? 'var(--purple-light)' : 'var(--green)',
              fontSize: '1rem', flexShrink: 0,
            }} />
            {f}
          </div>
        ))}
      </div>

      <a
        href={plan.ctaLink}
        className={plan.highlighted ? 'btn-primary' : 'btn-secondary'}
        style={{ justifyContent: 'center', width: '100%' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {plan.ctaText} <HiArrowRight />
        </span>
      </a>
    </motion.div>
  );
}

import { pricingData as defaultPricingData } from '../data/siteData';

export default function PricingSection() {
  const { pricingData } = useCms();
  const d = (pricingData && pricingData.sectionTitle && pricingData.plans) ? pricingData : defaultPricingData;

  return (
    <SectionWrapper id="pricing" className="grid-bg" animation="zoomIn">
      <SectionHeader title={d.sectionTitle} subtitle={d.sectionSubtitle} badge="Pricing" />
      <div className="responsive-grid-3" style={{ maxWidth: '1000px', margin: '0 auto', alignItems: 'stretch' }}>
        {d?.plans?.map((plan, i) => <PricingCard key={i} plan={plan} index={i} />)}
      </div>
    </SectionWrapper>
  );
}
