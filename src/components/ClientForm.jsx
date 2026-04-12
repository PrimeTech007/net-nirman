import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const STATUS_OPTIONS = ['design', 'development', 'testing', 'completed'];
const PAYMENT_OPTIONS = ['paid', 'pending'];
const PRIORITY_OPTIONS = ['high', 'normal'];

function toDateInputValue(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toISOString().split('T')[0];
}

export default function ClientForm({ client, onClose }) {
  const isEdit = !!client;
  const overlayRef = useRef(null);

  const [form, setForm] = useState({
    name: client?.name || '',
    projectType: client?.projectType || '',
    status: client?.status || 'design',
    progress: client?.progress ?? 0,
    deadline: client?.deadline ? toDateInputValue(client.deadline) : '',
    paymentStatus: client?.paymentStatus || 'pending',
    priority: client?.priority || 'normal',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.projectType.trim()) e.projectType = 'Project type is required';
    if (!form.deadline) e.deadline = 'Deadline is required';
    const p = Number(form.progress);
    if (isNaN(p) || p < 0 || p > 100) e.progress = 'Progress must be 0–100';
    return e;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const deadlineDate = new Date(form.deadline + 'T00:00:00');
      const payload = {
        name: form.name.trim(),
        projectType: form.projectType.trim(),
        status: form.status,
        progress: Number(form.progress),
        deadline: Timestamp.fromDate(deadlineDate),
        paymentStatus: form.paymentStatus,
        priority: form.priority,
      };

      if (isEdit) {
        await updateDoc(doc(db, 'clients', client.id), payload);
      } else {
        await addDoc(collection(db, 'clients'), { ...payload, createdAt: serverTimestamp() });
      }
      onClose();
    } catch (err) {
      console.error('Error saving client:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(124, 58, 237, 0.06)',
    border: `1px solid ${errors[field] ? 'var(--red)' : 'var(--border)'}`,
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    transition: 'border-color 0.2s',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const errorStyle = {
    color: 'var(--red)',
    fontSize: '0.75rem',
    marginTop: '4px',
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(11, 15, 26, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', margin: 0 }}>
              {isEdit ? 'Edit Client' : 'Add New Client'}
            </h2>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: '4px' }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>Client Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g. Acme Corp"
                style={inputStyle('name')}
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>

            {/* Project Type */}
            <div>
              <label style={labelStyle}>Project Type</label>
              <input
                type="text"
                value={form.projectType}
                onChange={e => handleChange('projectType', e.target.value)}
                placeholder="e.g. E-commerce Website"
                style={inputStyle('projectType')}
              />
              {errors.projectType && <p style={errorStyle}>{errors.projectType}</p>}
            </div>

            {/* Status + Priority row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Status</label>
                <select
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value)}
                  style={{ ...inputStyle('status'), cursor: 'pointer' }}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s} style={{ background: 'var(--bg-secondary)' }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select
                  value={form.priority}
                  onChange={e => handleChange('priority', e.target.value)}
                  style={{ ...inputStyle('priority'), cursor: 'pointer' }}
                >
                  {PRIORITY_OPTIONS.map(p => (
                    <option key={p} value={p} style={{ background: 'var(--bg-secondary)' }}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Progress */}
            <div>
              <label style={labelStyle}>Progress (0–100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.progress}
                onChange={e => handleChange('progress', e.target.value)}
                style={inputStyle('progress')}
              />
              {errors.progress && <p style={errorStyle}>{errors.progress}</p>}
            </div>

            {/* Deadline + Payment row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => handleChange('deadline', e.target.value)}
                  style={{ ...inputStyle('deadline'), colorScheme: 'dark' }}
                />
                {errors.deadline && <p style={errorStyle}>{errors.deadline}</p>}
              </div>
              <div>
                <label style={labelStyle}>Payment Status</label>
                <select
                  value={form.paymentStatus}
                  onChange={e => handleChange('paymentStatus', e.target.value)}
                  style={{ ...inputStyle('paymentStatus'), cursor: 'pointer' }}
                >
                  {PAYMENT_OPTIONS.map(p => (
                    <option key={p} value={p} style={{ background: 'var(--bg-secondary)' }}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1, padding: '11px', borderRadius: '8px',
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 2, padding: '11px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--purple), #6d28d9)',
                  border: 'none', color: 'white', cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '0.88rem', fontWeight: 600, opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Client'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
 