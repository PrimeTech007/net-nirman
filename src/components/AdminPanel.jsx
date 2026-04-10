import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCms } from '../data/cmsProvider';
import { HiDownload, HiUpload, HiTrash, HiSave, HiRefresh, HiLogout } from 'react-icons/hi';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const LABELS = {
  siteConfig: '⚙️ Site Settings',
  heroData: '🏠 Hero Section',
  problemSolutionData: '🧠 Problem → Solution',
  freeDemoData: '🎁 Free Demo Offer',
  projectsData: '💼 Demo Projects',
  processData: '⚙️ Process Steps',
  pricingData: '💰 Pricing',
  trustData: '🛡️ Trust / Why Us',
  aboutData: '👤 About',
  reviewsData: '⭐ Client Reviews',
  contactData: '📞 Contact',
  navLinks: '🔗 Navigation Links',
};

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await onLogin(email, pwd);
    if (!success) {
      setError('Invalid email or password.');
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative'
    }}>
      <Link to="/" style={{
        position: 'absolute', top: '24px', left: '24px', color: 'var(--text-muted)',
        textDecoration: 'none', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)', transition: 'all 0.2s'
      }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
        &larr; Back to Website
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-glow"
        style={{
          width: '100%', maxWidth: '420px', padding: '48px 40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--purple), var(--green))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.25)'
        }}>
          N
        </div>
        
        <h1 style={{
          fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
          color: 'var(--text-primary)', marginBottom: '8px'
        }}>
          Admin Panel
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '32px' }}>
          Secure login to manage your website content.
        </p>

        <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="admin-input" 
              placeholder="admin@netnirman.com" 
              required 
              style={{ width: '100%', padding: '12px 16px' }}
            />
          </div>
          
          <div style={{ textAlign: 'left', marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password
            </label>
            <input 
              type="password" 
              value={pwd}
              onChange={(e) => { setPwd(e.target.value); setError(''); }}
              className="admin-input" 
              placeholder="••••••••" 
              required 
              style={{ width: '100%', padding: '12px 16px' }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ color: 'var(--red)', fontSize: '0.82rem', marginTop: '16px', padding: '8px 12px', background: 'rgba(248,113,113,0.1)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)' }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

function SectionEditor({ sectionKey, data, onSave }) {
  const [json, setJson] = useState(() => JSON.stringify(data, null, 2));
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Only update if not typing to avoid cursor jumps
    if (!saved) {
      setJson(JSON.stringify(data, null, 2));
    }
  }, [data]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(json);
      if (parsed === null || typeof parsed !== 'object') {
        setError('Content must be an object or array');
        return;
      }
      onSave(sectionKey, parsed);
      setError(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError('Format Error: Please check your formatting. ' + e.message);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(json);
      setJson(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError('Cannot format — fix errors first.');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
        <button onClick={handleSave} className="btn-green" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
          <HiSave /> {saved ? 'Saved Successfully' : 'Publish Changes'}
        </button>
        <button onClick={handleFormat} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
          Format Text
        </button>
      </div>

      <textarea
        value={json}
        onChange={(e) => { setJson(e.target.value); setError(null); }}
        className="admin-input admin-textarea"
        style={{
          minHeight: '400px', fontSize: '0.85rem', fontFamily: '"Fira Code", monospace',
          lineHeight: 1.6, tabSize: 2, width: '100%', padding: '20px',
          background: 'rgba(11, 15, 26, 0.6)', border: '1px solid rgba(124, 58, 237, 0.2)'
        }}
        spellCheck={false}
      />

      {error && (
        <div style={{
          marginTop: '12px', padding: '12px 16px', borderRadius: '8px',
          background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
          fontSize: '0.85rem', color: 'var(--red)',
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const cms = useCms();
  const { loading, isAdmin, login, logout, updateSection, exportData, importData, SECTION_KEYS, seedDatabase } = cms;
  const [activeTab, setActiveTab] = useState(SECTION_KEYS[0]);

  // Handle file import
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (importData(ev.target.result)) {
          alert('Upload successful!');
          window.location.reload();
        } else {
          alert('Upload failed. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [importData]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>Loading secure environment...</div>;
  }

  if (!isAdmin) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <div style={{
        background: 'rgba(11, 15, 26, 0.95)', borderBottom: '1px solid var(--border)',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{
            color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s'
          }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            &larr; Website
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid var(--border)', paddingLeft: '24px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--purple), var(--green))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '1rem', fontWeight: 800,
            }}>N</div>
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Dashboard</h1>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Nirman Website Manager</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportData} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <HiDownload /> Backup
          </button>
          <button onClick={handleImport} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <HiUpload /> Restore
          </button>
          <button onClick={logout} className="admin-btn" style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--red)', border: '1px solid rgba(248,113,113,0.2)', padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HiLogout /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Sidebar */}
        <div className="admin-sidebar" style={{
          borderRight: '1px solid var(--border)', background: 'rgba(11,15,26,0.5)',
          display: 'flex', flexDirection: 'column', overflowY: 'auto'
        }}>
          <div style={{ padding: '24px 20px 12px' }}>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 700, margin: 0 }}>
              Sections
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px 24px' }}>
            {SECTION_KEYS.map(key => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '12px 16px', textAlign: 'left', borderRadius: '8px',
                  background: activeTab === key ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                  color: activeTab === key ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontWeight: activeTab === key ? 600 : 500,
                  transition: 'all 0.2s', borderLeft: activeTab === key ? '3px solid var(--purple)' : '3px solid transparent'
                }}
              >
                {LABELS[key] || key}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 'auto', padding: '24px', borderTop: '1px solid var(--border)' }}>
            <button onClick={() => {
              if (window.confirm('This will overwrite current DB with offline defaults. Proceed?')) {
                seedDatabase();
              }
            }} style={{
              width: '100%', background: 'none', border: '1px solid var(--border)',
              padding: '10px', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.8rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}>
              <HiRefresh /> Seed Database
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
          <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              {LABELS[activeTab] || activeTab}
            </h2>
            <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Edit the text in quotes to update your live website instantly.
            </p>
          </div>
          <SectionEditor sectionKey={activeTab} data={cms[activeTab]} onSave={updateSection} />
        </div>

      </div>
      <style>{`
        .admin-sidebar { width: 280px; }
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column !important; overflow: auto !important; }
          .admin-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--border) !important; flex-shrink: 0; }
        }
      `}</style>
    </div>
  );
}
