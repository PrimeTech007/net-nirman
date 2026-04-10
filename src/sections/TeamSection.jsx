import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper, { SectionHeader } from '../components/SectionWrapper';
import { useCms } from '../data/cmsProvider';

export default function TeamSection() {
  const { teamData } = useCms();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  if (!teamData) return null;

  return (
    <SectionWrapper id="team" className="grid-bg" animation="fadeIn">
      <SectionHeader title={teamData.sectionTitle} subtitle={teamData.sectionSubtitle} badge="Our Team" />
      
      <div 
        ref={ref}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {teamData.members.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="glass-card-glow"
            style={{
              padding: '40px 32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--purple), var(--green))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              marginBottom: '8px'
            }}>
              {member.image ? (
                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '3rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
                  {member.name.charAt(0)}
                </span>
              )}
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {member.name}
              </h3>
              <p className="gradient-text-purple" style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {member.role}
              </p>
            </div>
            
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '8px' }}>
              {member.bio}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
