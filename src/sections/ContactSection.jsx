import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionWrapper, { SectionHeader } from '../components/SectionWrapper';
import { useCms } from '../data/cmsProvider';
import { HiOutlineMail, HiOutlinePhone, HiArrowRight } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function ContactSection() {
  const { contactData, siteConfig } = useCms();
  const d = contactData;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Get reCAPTCHA token
      if (!executeRecaptcha) {
        throw new Error('reCAPTCHA not loaded');
      }
      const token = await executeRecaptcha('contact_form');

      // Send to Serverless API
      let response;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        await new Promise(r => setTimeout(r, 1000));
        response = { ok: true, json: async () => ({ message: 'Mock sent' }) };
      } else {
        response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            recaptchaToken: token,
          })
        });
      }

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '', honeypot: '' });
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Failed to send message.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again.');
    }
  };

  const waUrl = `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I'm%20interested%20in%20your%20web%20development%20services.`;

  return (
    <SectionWrapper id="contact" className="grid-bg" animation="slideUp">
      <SectionHeader title={d.sectionTitle} subtitle={d.sectionSubtitle} badge="Get In Touch" />

      <div ref={ref} style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '48px', maxWidth: '900px', margin: '0 auto', alignItems: 'start',
      }} className="contact-grid">
        {/* Form */}
        <motion.form
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="glass-card"
          style={{ padding: '36px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Honeypot field (hidden from real users) */}
            <input type="text" 
              style={{ display: 'none' }} 
              value={form.honeypot} 
              onChange={(e) => setForm({...form, honeypot: e.target.value})} 
              tabIndex={-1} autoComplete="off" 
            />

            <div>
              <label style={{
                display: 'block', fontSize: '0.78rem', fontWeight: 600,
                color: 'var(--text-secondary)', marginBottom: '8px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>Name</label>
              <input type="text" className="form-input" placeholder={d.formFields.name}
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label style={{
                display: 'block', fontSize: '0.78rem', fontWeight: 600,
                color: 'var(--text-secondary)', marginBottom: '8px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>Email</label>
              <input type="email" className="form-input" placeholder={d.formFields.email}
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label style={{
                display: 'block', fontSize: '0.78rem', fontWeight: 600,
                color: 'var(--text-secondary)', marginBottom: '8px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>Message</label>
              <textarea className="form-input" placeholder={d.formFields.message}
                rows={5} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })} required
                style={{ resize: 'vertical', minHeight: '120px' }} />
            </div>
            <button type="submit" className="btn-green" disabled={status === 'submitting'} style={{ width: '100%', justifyContent: 'center' }}>
              {status === 'submitting' ? 'Sending...' : status === 'success' ? '✓ Sent!' : d.submitText} 
              {status !== 'success' && status !== 'submitting' && <HiArrowRight />}
            </button>
            
            {status === 'error' && (
              <p style={{ color: 'var(--red)', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
                {errorMessage}
              </p>
            )}
          </div>
        </motion.form>

        {/* Right side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {/* Highlights */}
          <div className="glass-card" style={{
            padding: '24px',
            background: 'rgba(34,197,94,0.04)',
            borderColor: 'rgba(34,197,94,0.12)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {d.highlights.map((h, i) => (
                <div key={i} style={{
                  fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6,
                }}>
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp */}
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="whatsapp-btn" style={{ justifyContent: 'center' }}>
            <FaWhatsapp style={{ fontSize: '1.2rem' }} /> {d.whatsappText}
          </a>

          {/* Email */}
          <div className="glass-card" style={{
            padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(124,58,237,0.08)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', color: 'var(--purple-light)', flexShrink: 0,
            }}>
              <HiOutlineMail />
            </div>
            <div>
              <div style={{
                fontSize: '0.7rem', color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px',
              }}>Email</div>
              <a href={`mailto:${siteConfig.email}`} style={{
                color: 'var(--text-primary)', textDecoration: 'none',
                fontSize: '0.9rem', fontWeight: 500,
              }}>
                {siteConfig.email}
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="glass-card" style={{
            padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(34,197,94,0.08)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', color: 'var(--green)', flexShrink: 0,
            }}>
              <HiOutlinePhone />
            </div>
            <div>
              <div style={{
                fontSize: '0.7rem', color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px',
              }}>Phone</div>
              <a href={`tel:${siteConfig.phone}`} style={{
                color: 'var(--text-primary)', textDecoration: 'none',
                fontSize: '0.9rem', fontWeight: 500,
              }}>
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </SectionWrapper>
  );
}
