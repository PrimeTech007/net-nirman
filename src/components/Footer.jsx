import { useCms } from '../data/cmsProvider';
import { FaTwitter, FaLinkedinIn, FaGithub, FaInstagram } from 'react-icons/fa';

const socialIcons = { twitter: FaTwitter, linkedin: FaLinkedinIn, github: FaGithub, instagram: FaInstagram };
const socialBrandColors = { twitter: '#000000', linkedin: '#0A66C2', github: '#181717', instagram: '#E1306C' };

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
                    width: '44px', height: '44px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: socialBrandColors[key] || 'var(--text-muted)', textDecoration: 'none',
                    transition: 'all 0.2s', fontSize: '1rem',
                  }}
                  title={key === 'twitter' ? 'X' : key.charAt(0).toUpperCase() + key.slice(1)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              &copy; {year} {siteConfig.name}. All rights reserved.
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '420px', lineHeight: 1.5 }}>
              This site is protected by reCAPTCHA and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Google Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Terms of Service</a> apply.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Desgn & Developed by Net Nirman
            </p>
            <a href="/admin" style={{ 
              fontSize: '0.75rem', color: 'white', textDecoration: 'none',
              padding: '10px 18px', borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.18), rgba(34, 197, 94, 0.16))',
              border: '1px solid rgba(124, 58, 237, 0.25)',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.12)',
              transition: 'transform 0.2s, opacity 0.2s, box-shadow 0.2s',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.opacity = '1';
            }}>
              👑 Admin
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
