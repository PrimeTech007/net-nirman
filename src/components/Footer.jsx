import { useCms } from '../data/cmsProvider';
import { FaTwitter, FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa';

const socialIcons = { twitter: FaTwitter, linkedin: FaLinkedinIn, github: FaGithub, instagram: FaInstagram };

export default function Footer() {
  const { siteConfig, navLinks } = useCms();
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--border)', padding: '60px 0 40px',
      background: 'var(--bg-secondary)',
    }}>
      <div className="section-container">
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
          gap: '48px', marginBottom: '48px',
        }} className="footer-grid">
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700,
              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <img src="/finalLogo2.png" alt="Net Nirman Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              <span className="gradient-text-purple">{siteConfig.name}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '300px' }}>
              Helping businesses get more customers through fast, modern, high-converting websites.
            </p>
          </div>

          <div>
            <h4 style={{
              fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '20px',
            }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} style={{
                  fontSize: '0.88rem', color: 'var(--text-secondary)',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{
              fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '20px',
            }}>Connect</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(siteConfig.socialLinks).map(([key, url]) => {
                const Icon = socialIcons[key];
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'rgba(124,58,237,0.04)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', textDecoration: 'none',
                    transition: 'all 0.3s', fontSize: '0.95rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                    e.currentTarget.style.color = 'var(--purple-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.04)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}>
                    {Icon && <Icon />}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Built to grow your business 🚀
            </p>
            <a href="/admin" style={{ 
              fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none',
              opacity: 0.5, transition: 'opacity 0.2s' 
            }}
            onMouseEnter={(e) => e.target.style.opacity = 1}
            onMouseLeave={(e) => e.target.style.opacity = 0.5}>
              Admin
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </footer>
  );
}
