import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSave, HiEye, HiEyeOff, HiCode } from 'react-icons/hi';
import FieldRenderer from './FieldRenderer';

export default function VisualSectionEditor({ sectionKey, data, onSave, label }) {
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(data ?? {})));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [rawJson, setRawJson] = useState('');
  const [rawError, setRawError] = useState(null);
  const [dirty, setDirty] = useState(false);

  // sync when parent data changes (e.g. real-time Firestore update)
  useEffect(() => {
    if (!dirty) {
      setLocal(JSON.parse(JSON.stringify(data ?? {})));
    }
  }, [data]);

  const update = (key, value) => {
    setLocal(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(sectionKey, local);
    setSaving(false);
    if (ok !== false) {
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const openRaw = () => {
    setRawJson(JSON.stringify(local, null, 2));
    setRawError(null);
    setShowRaw(true);
  };

  const applyRaw = () => {
    try {
      const parsed = JSON.parse(rawJson);
      setLocal(parsed);
      setDirty(true);
      setShowRaw(false);
    } catch (e) {
      setRawError('Invalid JSON: ' + e.message);
    }
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: '860px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            {label}
          </h2>
          {dirty && (
            <span style={{ fontSize: '0.72rem', color: '#facc15', marginTop: '2px', display: 'block' }}>
              ● Unsaved changes
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={openRaw}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
              color: 'var(--text-muted)', cursor: 'pointer',
            }}
          >
            <HiCode /> Raw JSON
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700,
              background: saved
                ? 'rgba(34,197,94,0.15)'
                : 'linear-gradient(135deg, var(--purple), #6d28d9)',
              border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none',
              color: saved ? '#22c55e' : 'white',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            <HiSave size={15} />
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {Object.entries(local).map(([key, value]) => (
          <div
            key={key}
            style={{
              background: 'rgba(15,20,36,0.6)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '18px 20px',
            }}
          >
            <FieldRenderer
              fieldKey={key}
              value={value}
              onChange={nv => update(key, nv)}
              sectionKey={sectionKey}
            />
          </div>
        ))}
      </div>

      {/* Raw JSON Modal */}
      <AnimatePresence>
        {showRaw && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) setShowRaw(false); }}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(11,15,26,0.9)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: '14px', width: '100%', maxWidth: '680px',
                maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
              }}
            >
              <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Raw JSON Editor</h3>
                <button onClick={() => setShowRaw(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}>×</button>
              </div>
              <textarea
                value={rawJson}
                onChange={e => { setRawJson(e.target.value); setRawError(null); }}
                style={{
                  flex: 1, padding: '18px', background: 'rgba(11,15,26,0.6)',
                  border: 'none', color: 'var(--text-primary)', fontSize: '0.82rem',
                  fontFamily: '"Fira Code", monospace', lineHeight: 1.6, outline: 'none', resize: 'none',
                }}
                spellCheck={false}
              />
              {rawError && (
                <div style={{ padding: '10px 18px', background: 'rgba(248,113,113,0.1)', color: 'var(--red)', fontSize: '0.8rem' }}>
                  ⚠ {rawError}
                </div>
              )}
              <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowRaw(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Cancel</button>
                <button onClick={applyRaw} style={{ padding: '8px 18px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--purple), #6d28d9)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Apply</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
