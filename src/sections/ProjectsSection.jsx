import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper, { SectionHeader } from '../components/SectionWrapper';
import { useCms } from '../data/cmsProvider';
import { HiOutlineExternalLink, HiOutlineCode } from 'react-icons/hi';

function ProjectCard({ project, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="glass-card-glow"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* Image placeholder */}
      <div style={{
        height: '200px',
        background: `linear-gradient(135deg, ${project.accentColor}18, ${project.accentColor}06)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${project.accentColor}12 1px, transparent 1px), linear-gradient(90deg, ${project.accentColor}12 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />
        <div style={{
          position: 'relative', width: '64px', height: '64px', borderRadius: '16px',
          background: `${project.accentColor}18`, border: `1px solid ${project.accentColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', color: project.accentColor,
        }}>
          <HiOutlineCode />
        </div>
        <div style={{
          position: 'absolute', top: '16px', left: '16px',
          padding: '4px 12px', borderRadius: '999px',
          background: `${project.accentColor}18`, border: `1px solid ${project.accentColor}30`,
          fontSize: '0.68rem', fontWeight: 700, color: project.accentColor,
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          {project.label}
        </div>
      </div>

      <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px',
          fontFamily: 'var(--font-heading)',
        }}>
          {project.title}
        </h3>

        {/* Business benefit */}
        <div style={{
          padding: '6px 12px', borderRadius: '6px',
          background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)',
          fontSize: '0.78rem', fontWeight: 600, color: 'var(--green-light)',
          marginBottom: '14px', display: 'inline-block', alignSelf: 'flex-start',
        }}>
          📈 {project.businessBenefit}
        </div>

        <p style={{
          fontSize: '0.88rem', color: 'var(--text-secondary)',
          marginBottom: '20px', lineHeight: 1.7, flex: 1,
        }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {project.features.map((f, i) => (
            <span key={i} style={{
              padding: '4px 12px', borderRadius: '6px',
              background: 'rgba(124,58,237,0.05)', border: '1px solid var(--border)',
              fontSize: '0.73rem', fontWeight: 500, color: 'var(--text-secondary)',
            }}>
              {f}
            </span>
          ))}
        </div>

        <a href={project.demoUrl} className="btn-secondary" style={{
          justifyContent: 'center', fontSize: '0.85rem', padding: '10px 20px',
        }}>
          <HiOutlineExternalLink /> View Demo
        </a>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const { projectsData } = useCms();
  const d = projectsData;

  return (
    <SectionWrapper id="projects" animation="fadeUp">
      <SectionHeader title={d.sectionTitle} subtitle={d.sectionSubtitle} badge="Portfolio" />
      <div className="responsive-grid-3">
        {d.projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
