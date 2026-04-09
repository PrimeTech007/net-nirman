import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper, { SectionHeader } from '../components/SectionWrapper';
import { useCms } from '../data/cmsProvider';
import { HiStar, HiOutlineUser } from 'react-icons/hi';

function ReviewCard({ review, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`glass-card ${review.isPlaceholder ? 'placeholder-card' : ''}`}
      style={{ padding: '32px' }}
    >
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {Array.from({ length: review.rating }, (_, i) => (
          <HiStar key={i} style={{
            color: review.isPlaceholder ? 'var(--text-muted)' : '#f59e0b',
            fontSize: '1rem', opacity: review.isPlaceholder ? 0.25 : 1,
          }} />
        ))}
      </div>

      <p style={{
        fontSize: '0.9rem',
        color: review.isPlaceholder ? 'var(--text-muted)' : 'var(--text-secondary)',
        lineHeight: 1.7, marginBottom: '24px',
        fontStyle: review.isPlaceholder ? 'italic' : 'normal',
      }}>
        "{review.content}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: review.isPlaceholder
            ? 'rgba(124,58,237,0.04)' : 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(34,197,94,0.1))',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', color: 'var(--text-muted)',
        }}>
          <HiOutlineUser />
        </div>
        <div>
          <div style={{
            fontSize: '0.9rem', fontWeight: 600,
            color: review.isPlaceholder ? 'var(--text-muted)' : 'var(--text-primary)',
          }}>
            {review.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{review.role}</div>
        </div>
      </div>

      {review.isPlaceholder && (
        <div style={{
          marginTop: '16px', padding: '4px 10px', borderRadius: '6px',
          background: 'rgba(124,58,237,0.04)', display: 'inline-block',
          fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500,
        }}>
          ⏳ Reviews coming soon
        </div>
      )}
    </motion.div>
  );
}

export default function ReviewsSection() {
  const { reviewsData } = useCms();
  const d = reviewsData;

  return (
    <SectionWrapper id="reviews" animation="fadeUp">
      <SectionHeader title={d.sectionTitle} subtitle={d.sectionSubtitle} badge="Testimonials" />
      <div className="responsive-grid-3" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {d.reviews.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
      </div>
    </SectionWrapper>
  );
}
