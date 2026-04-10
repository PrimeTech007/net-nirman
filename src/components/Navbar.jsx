import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCms } from '../data/cmsProvider';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { siteConfig, navLinks } = useCms();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} id="navbar">
      <div className="section-container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <img src="/finalLogo2.png" alt="Net Nirman Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <span className="gradient-text-purple">{siteConfig.name}</span>
            </motion.div>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="nav-desktop">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
              >
                <Link
                  to={link.href}
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#fff';
                    e.target.style.background = 'rgba(124,58,237,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--text-secondary)';
                    e.target.style.background = 'transparent';
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ marginLeft: '8px' }}
            >
              <a href="https://wa.me/917818832387?text=Hello%20team%20Net%20Nirman%2C%20I%20want%20to%20book%20an%20apointment" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
                <span>Get Free Demo</span>
              </a>
            </motion.div>
          </div>

          {/* Mobile button */}
          <button
            className="nav-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '8px',
              zIndex: 110,
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(11, 15, 26, 0.97)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '28px',
              zIndex: 105,
            }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginTop: '12px' }}
            >
              <a
                href="https://wa.me/917818832387?text=Hello%20team%20Net%20Nirman%2C%20I%20want%20to%20book%20an%20apointment"
                target="_blank" rel="noopener noreferrer"
                className="btn-primary"
                onClick={() => setMobileOpen(false)}
              >
                <span>Get Free Demo</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
