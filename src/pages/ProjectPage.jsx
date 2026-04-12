import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  doc, getDoc, onSnapshot, collection,
  addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  HiArrowLeft, HiPlus, HiPencil, HiTrash, HiCheck,
  HiClock, HiDocumentText, HiChip, HiColorSwatch, HiCloud
} from 'react-icons/hi';
import { useCms } from '../data/cmsProvider';

/* ── helpers ── */
function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function toDateInput(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toISOString().split('T')[0];
}

/* ── badge styles ── */
const TASK_STATUS_STYLES = {
  pending:     { background: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.2)' },
  in_progress: { background: 'rgba(250,204,21,0.12)',  color: '#facc15', border: '1px solid rgba(250,204,21,0.25)' },
  completed:   { background: 'rgba(34,197,94,0.12)',   color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' },
};

function Badge({ label, styleMap }) {
  const s = styleMap[label] || {};
  const display = label?.replace('_', ' ') || '';
  return (
    <span style={{
      ...s, padding: '3px 10px', borderRadius: '20px',
      fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap',
    }}>
      {display}
    </span>
  );
}

function ProgressBar({ value, height = 8 }) {
  const pct = Math.min(100, Math.max(0, value || 0));
  const color = pct === 100 ? 'var(--green)' : pct >= 60 ? '#38bdf8' : pct >= 30 ? '#facc15' : '#f87171';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: `${height}px`, background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: '99px' }}
        />
      </div>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '36px', textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

/* ── Phase icons ── */
const PHASE_META = {
  design:      { label: 'Design',      icon: HiColorSwatch, color: '#38bdf8' },
  development: { label: 'Development', icon: HiChip,        color: '#facc15' },
  testing:     { label: 'Testing',     icon: HiDocumentText,color: '#fb923c' },
  deployment:  { label: 'Deployment',  icon: HiCloud,       color: '#a78bfa' },
};

/* ── Task Form Modal ── */
function TaskForm({ projectId, task, onClose }) {
  const isEdit = !!task;
  const [form, setForm] = useState({
    title: task?.title || '',
    assignedTo: task?.assignedTo || '',
    status: task?.status || 'pending',
    deadline: task?.deadline ? toDateInput(task.deadline) : '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.assignedTo.trim()) e.assignedTo = 'Assigned to is required';
    if (!form.deadline) e.deadline = 'Deadline is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        assignedTo: form.assignedTo.trim(),
        status: form.status,
        deadline: Timestamp.fromDate(new Date(form.deadline + 'T00:00:00')),
      };
      const tasksCol = collection(db, 'projects', projectId, 'tasks');
      if (isEdit) {
        await updateDoc(doc(db, 'projects', projectId, 'tasks', task.id), payload);
      } else {
        await addDoc(tasksCol, { ...payload, createdAt: serverTimestamp() });
      }
      onClose();
    } catch (err) {
      console.error('Task save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const inp = (field) => ({
    width: '100%', padding: '10px 14px',
    background: 'rgba(124,58,237,0.06)',
    border: `1px solid ${errors[field] ? 'var(--red)' : 'var(--border)'}`,
    borderRadius: '8px', color: 'var(--text-primary)',
    fontSize: '0.88rem', outline: 'none', fontFamily: 'var(--font-body)',
  });

  const lbl = { display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const err = { color: 'var(--red)', fontSize: '0.73rem', marginTop: '3px' };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(11,15,26,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '460px', padding: '28px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isEdit ? 'Edit Task' : 'Add Task'}
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}>×</button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={lbl}>Task Title</label>
              <input type="text" value={form.title} onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setErrors(p => ({ ...p, title: undefined })); }} placeholder="e.g. Design homepage mockup" style={inp('title')} />
              {errors.title && <p style={err}>{errors.title}</p>}
            </div>
            <div>
              <label style={lbl}>Assigned To</label>
              <input type="text" value={form.assignedTo} onChange={e => { setForm(p => ({ ...p, assignedTo: e.target.value })); setErrors(p => ({ ...p, assignedTo: undefined })); }} placeholder="e.g. Himesh" style={inp('assignedTo')} />
              {errors.assignedTo && <p style={err}>{errors.assignedTo}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inp('status'), cursor: 'pointer' }}>
                  {['pending', 'in_progress', 'completed'].map(s => (
                    <option key={s} value={s} style={{ background: 'var(--bg-secondary)' }}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Deadline</label>
                <input type="date" value={form.deadline} onChange={e => { setForm(p => ({ ...p, deadline: e.target.value })); setErrors(p => ({ ...p, deadline: undefined })); }} style={{ ...inp('deadline'), colorScheme: 'dark' }} />
                {errors.deadline && <p style={err}>{errors.deadline}</p>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ flex: 2, padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--purple), #6d28d9)', border: 'none', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.88rem', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Notes Editor ── */
function NotesEditor({ projectId, notes }) {
  const [text, setText] = useState(notes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setText(notes || ''); }, [notes]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'projects', projectId), { notes: text });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Notes save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add project notes, updates, or important information..."
        style={{
          width: '100%', minHeight: '140px', padding: '14px 16px',
          background: 'rgba(124,58,237,0.04)', border: '1px solid var(--border)',
          borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.88rem',
          fontFamily: 'var(--font-body)', lineHeight: 1.6, outline: 'none', resize: 'vertical',
        }}
      />
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          marginTop: '10px', padding: '8px 20px', borderRadius: '8px',
          background: saved ? 'rgba(34,197,94,0.15)' : 'rgba(124,58,237,0.15)',
          border: `1px solid ${saved ? 'rgba(34,197,94,0.3)' : 'rgba(124,58,237,0.3)'}`,
          color: saved ? '#22c55e' : 'var(--purple-light, #a78bfa)',
          cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontWeight: 600,
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Notes'}
      </button>
    </div>
  );
}

/* ── Phase Toggle ── */
function PhaseTracker({ projectId, phases }) {
  const [updating, setUpdating] = useState(null);

  const toggle = async (key) => {
    if (key === 'development') return; // development is a number, handled separately
    setUpdating(key);
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        [`phases.${key}`]: !phases[key],
      });
    } catch (err) {
      console.error('Phase toggle error:', err);
    } finally {
      setUpdating(null);
    }
  };

  const updateDevProgress = async (val) => {
    const num = Math.min(100, Math.max(0, Number(val)));
    try {
      await updateDoc(doc(db, 'projects', projectId), { 'phases.development': num });
    } catch (err) {
      console.error('Dev progress error:', err);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
      {Object.entries(PHASE_META).map(([key, meta]) => {
        const Icon = meta.icon;
        const isDev = key === 'development';
        const isActive = isDev ? (phases?.development > 0) : !!phases?.[key];
        return (
          <div
            key={key}
            onClick={() => !isDev && toggle(key)}
            style={{
              padding: '16px', borderRadius: '12px', cursor: isDev ? 'default' : 'pointer',
              border: `1px solid ${isActive ? meta.color + '40' : 'var(--border)'}`,
              background: isActive ? meta.color + '0d' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s', opacity: updating === key ? 0.6 : 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isDev ? '10px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon style={{ color: isActive ? meta.color : 'var(--text-muted)', fontSize: '1.1rem' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {meta.label}
                </span>
              </div>
              {!isDev && (
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: `2px solid ${isActive ? meta.color : 'var(--border)'}`,
                  background: isActive ? meta.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {isActive && <HiCheck style={{ color: 'white', fontSize: '0.65rem' }} />}
                </div>
              )}
            </div>
            {isDev && (
              <div>
                <ProgressBar value={phases?.development} height={6} />
                <input
                  type="range" min="0" max="100" value={phases?.development || 0}
                  onChange={e => updateDevProgress(e.target.value)}
                  onClick={e => e.stopPropagation()}
                  style={{ width: '100%', marginTop: '8px', accentColor: meta.color, cursor: 'pointer' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Page ── */
export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, loading: cmsLoading } = useCms();
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [taskModal, setTaskModal] = useState(undefined); // undefined=closed, null=new, obj=edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* auth guard */
  useEffect(() => {
    if (!cmsLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, cmsLoading, navigate]);

  /* project listener */
  useEffect(() => {
    if (cmsLoading || !isAdmin || !id) return;
    const unsub = onSnapshot(doc(db, 'projects', id), async (snap) => {
      if (!snap.exists()) { setLoadingProject(false); return; }
      const data = { id: snap.id, ...snap.data() };
      setProject(data);
      // fetch client name
      if (data.clientId) {
        try {
          const clientSnap = await getDoc(doc(db, 'clients', data.clientId));
          if (clientSnap.exists()) setClient({ id: clientSnap.id, ...clientSnap.data() });
        } catch (_) {}
      }
      setLoadingProject(false);
    });
    return unsub;
  }, [authChecked, id]);

  /* tasks listener */
  useEffect(() => {
    if (cmsLoading || !isAdmin) return;
    const unsub = onSnapshot(collection(db, 'projects', id, 'tasks'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0));
      setTasks(data);
    });
    return unsub;
  }, [authChecked, id]);

  const handleDeleteTask = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'projects', id, 'tasks', deleteTarget.id));
    } catch (err) {
      console.error('Delete task error:', err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const cycleTaskStatus = async (task) => {
    const cycle = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
    try {
      await updateDoc(doc(db, 'projects', id, 'tasks', task.id), { status: cycle[task.status] });
    } catch (err) {
      console.error('Status cycle error:', err);
    }
  };

  // overall progress = avg of phase completion
  const calcProgress = () => {
    if (!project?.phases) return 0;
    const { design, development, testing, deployment } = project.phases;
    const vals = [design ? 100 : 0, development || 0, testing ? 100 : 0, deployment ? 100 : 0];
    return Math.round(vals.reduce((a, b) => a + b, 0) / 4);
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
  };

  const card = {
    background: 'rgba(15,20,36,0.7)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '24px',
  };

  const sectionTitle = {
    fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '16px', margin: '0 0 16px',
  };

  if (cmsLoading || !isAdmin) return null;

  if (loadingProject) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontSize: '3rem' }}>🔍</div>
        <p style={{ color: 'var(--text-muted)' }}>Project not found.</p>
        <Link to="/dashboard/clients" style={{ color: 'var(--purple-light, #a78bfa)', textDecoration: 'none', fontSize: '0.88rem' }}>← Back to Clients</Link>
      </div>
    );
  }

  const overallProgress = calcProgress();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {/* Navbar */}
      <div style={{
        background: 'rgba(11,15,26,0.95)', borderBottom: '1px solid var(--border)',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/dashboard/clients" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <HiArrowLeft /> Clients
          </Link>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {client?.name || 'Project Detail'}
            </h1>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>{client?.projectType || 'Project'}</p>
          </div>
        </div>
        <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.82rem' }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ← Dashboard
        </Link>
      </div>

      {/* Content */}
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Overall Progress */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: 700 }}>{client?.name || '—'}</h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{client?.projectType}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: 'Tasks', value: taskStats.total },
                { label: 'Done', value: taskStats.completed, color: '#22c55e' },
                { label: 'Active', value: taskStats.inProgress, color: '#facc15' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overall Progress</span>
          </div>
          <ProgressBar value={overallProgress} height={10} />
        </motion.div>

        {/* Phase Tracker */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={card}>
          <h3 style={sectionTitle}>Phase Tracking</h3>
          <PhaseTracker projectId={id} phases={project.phases} />
        </motion.div>

        {/* Tasks */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ ...sectionTitle, margin: 0 }}>Tasks</h3>
            <button
              onClick={() => setTaskModal(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px',
                borderRadius: '7px', background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.25)', color: 'var(--purple-light, #a78bfa)',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
              }}
            >
              <HiPlus /> Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No tasks yet. Add the first one!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                    borderRadius: '10px', background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                >
                  {/* Status toggle circle */}
                  <button
                    onClick={() => cycleTaskStatus(task)}
                    title="Click to cycle status"
                    style={{
                      width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${task.status === 'completed' ? '#22c55e' : task.status === 'in_progress' ? '#facc15' : 'var(--border)'}`,
                      background: task.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'transparent',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {task.status === 'completed' && <HiCheck style={{ color: '#22c55e', fontSize: '0.7rem' }} />}
                    {task.status === 'in_progress' && <HiClock style={{ color: '#facc15', fontSize: '0.7rem' }} />}
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      opacity: task.status === 'completed' ? 0.6 : 1,
                    }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      👤 {task.assignedTo} · 📅 {formatDate(task.deadline)}
                    </div>
                  </div>

                  <Badge label={task.status} styleMap={TASK_STATUS_STYLES} />

                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button onClick={() => setTaskModal(task)} style={{ padding: '5px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'rgba(124,58,237,0.1)', color: 'var(--purple-light, #a78bfa)', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
                    ><HiPencil size={13} /></button>
                    <button onClick={() => setDeleteTarget(task)} style={{ padding: '5px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'rgba(248,113,113,0.1)', color: 'var(--red)', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                    ><HiTrash size={13} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Notes */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={card}>
          <h3 style={sectionTitle}>Notes</h3>
          <NotesEditor projectId={id} notes={project.notes} />
        </motion.div>

      </div>

      {/* Task Modal */}
      {taskModal !== undefined && (
        <TaskForm projectId={id} task={taskModal} onClose={() => setTaskModal(undefined)} />
      )}

      {/* Delete Task Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(11,15,26,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px', maxWidth: '360px', width: '100%', textAlign: 'center' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🗑️</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Delete Task?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                "<strong style={{ color: 'var(--text-primary)' }}>{deleteTarget.title}</strong>" will be permanently deleted.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: '9px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Cancel</button>
                <button onClick={handleDeleteTask} disabled={deleting} style={{ flex: 1, padding: '9px', borderRadius: '8px', background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--red)', cursor: deleting ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 600, opacity: deleting ? 0.7 : 1 }}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
