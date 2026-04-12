import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { HiPencil, HiTrash, HiPlus, HiSearch, HiUsers, HiExternalLink } from 'react-icons/hi';
import ClientForm from '../components/ClientForm';
import { useCms } from '../data/cmsProvider';

/* ── helpers ── */
function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isOverdue(client) {
  if (!client.deadline || client.status === 'completed') return false;
  const d = client.deadline.toDate ? client.deadline.toDate() : new Date(client.deadline);
  return d < new Date();
}

/* ── badge styles ── */
const STATUS_STYLES = {
  design:      { background: 'rgba(56,189,248,0.12)',  color: '#38bdf8', border: '1px solid rgba(56,189,248,0.25)' },
  development: { background: 'rgba(250,204,21,0.12)',  color: '#facc15', border: '1px solid rgba(250,204,21,0.25)' },
  testing:     { background: 'rgba(251,146,60,0.12)',  color: '#fb923c', border: '1px solid rgba(251,146,60,0.25)' },
  completed:   { background: 'rgba(34,197,94,0.12)',   color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' },
};

const PAYMENT_STYLES = {
  paid:    { background: 'rgba(34,197,94,0.12)',  color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' },
  pending: { background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' },
};

const PRIORITY_STYLES = {
  high:   { background: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.25)' },
  normal: { background: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.2)' },
};

function Badge({ label, styleMap }) {
  const s = styleMap[label] || {};
  return (
    <span style={{
      ...s, padding: '3px 10px', borderRadius: '20px',
      fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct === 100 ? 'var(--green)' : pct >= 60 ? '#38bdf8' : pct >= 30 ? '#facc15' : '#f87171';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '30px' }}>{pct}%</span>
    </div>
  );
}

const TABS = ['All', 'Active', 'Completed', 'Overdue'];

export default function ClientsPage() {
  const navigate = useNavigate();
  const { isAdmin, loading: cmsLoading } = useCms();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [modalClient, setModalClient] = useState(undefined); // undefined=closed, null=new, obj=edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* open or create project for a client */
  const openProject = async (client) => {
    // check if project already exists for this client
    try {
      const q = query(collection(db, 'projects'), where('clientId', '==', client.id));
      const snap = await getDocs(q);
      if (!snap.empty) {
        navigate(`/dashboard/project/${snap.docs[0].id}`);
      } else {
        // create a new project doc
        const ref = await addDoc(collection(db, 'projects'), {
          clientId: client.id,
          phases: { design: false, development: 0, testing: false, deployment: false },
          notes: '',
          createdAt: serverTimestamp(),
        });
        navigate(`/dashboard/project/${ref.id}`);
      }
    } catch (err) {
      console.error('Open project error:', err);
    }
  };

  /* auth guard */
  useEffect(() => {
    if (!cmsLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, cmsLoading, navigate]);

  /* real-time clients listener */
  useEffect(() => {
    if (cmsLoading || !isAdmin) return;
    const unsub = onSnapshot(collection(db, 'clients'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? 0;
        const tb = b.createdAt?.toMillis?.() ?? 0;
        return tb - ta;
      });
      setClients(data);
      setLoading(false);
    }, (err) => {
      console.error('Clients listener error:', err);
      setLoading(false);
    });
    return unsub;
  }, [isAdmin, cmsLoading]);

  /* filtering */
  const filtered = clients.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeTab === 'Active') return c.status !== 'completed';
    if (activeTab === 'Completed') return c.status === 'completed';
    if (activeTab === 'Overdue') return isOverdue(c);
    return true;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'clients', deleteTarget.id));
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (cmsLoading || !isAdmin) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {/* Top Navbar */}
      <div style={{
        background: 'rgba(11,15,26,0.95)', borderBottom: '1px solid var(--border)',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/admin" style={{
            color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            &larr; Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--border)', paddingLeft: '24px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--purple), var(--green))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '1rem',
            }}>
              <HiUsers />
            </div>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                Client Management
              </h1>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>Track projects &amp; progress</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setModalClient(null)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 18px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--purple), #6d28d9)',
            border: 'none', color: 'white', cursor: 'pointer',
            fontSize: '0.85rem', fontWeight: 600,
          }}
        >
          <HiPlus /> Add Client
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Search + Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '340px' }}>
            <HiSearch style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', fontSize: '1rem', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px 9px 36px',
                background: 'rgba(124,58,237,0.06)', border: '1px solid var(--border)',
                borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem',
                outline: 'none', fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border)' }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 16px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                  fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s',
                  background: activeTab === tab ? 'rgba(124,58,237,0.2)' : 'transparent',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {filtered.length} client{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div style={{
          background: 'rgba(15,20,36,0.7)', border: '1px solid var(--border)',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading clients...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👥</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {search ? 'No clients match your search.' : 'No clients yet. Add your first one!'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    {['Name', 'Project Type', 'Status', 'Progress', 'Deadline', 'Payment', 'Priority', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left',
                        fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.06em', color: 'var(--text-muted)', whiteSpace: 'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client, i) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      style={{
                        borderBottom: '1px solid rgba(124,58,237,0.06)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        {client.name}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {client.projectType}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Badge label={client.status} styleMap={STATUS_STYLES} />
                      </td>
                      <td style={{ padding: '14px 16px', minWidth: '130px' }}>
                        <ProgressBar value={client.progress} />
                      </td>
                      <td style={{ padding: '14px 16px', color: isOverdue(client) ? 'var(--red)' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {formatDate(client.deadline)}
                        {isOverdue(client) && <span style={{ marginLeft: '4px', fontSize: '0.7rem' }}>⚠</span>}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Badge label={client.paymentStatus} styleMap={PAYMENT_STYLES} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Badge label={client.priority} styleMap={PRIORITY_STYLES} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => openProject(client)}
                            title="View Project"
                            style={{
                              padding: '6px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                              background: 'rgba(34,197,94,0.1)', color: '#22c55e',
                              display: 'flex', alignItems: 'center', transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}
                          >
                            <HiExternalLink size={15} />
                          </button>
                          <button
                            onClick={() => setModalClient(client)}
                            title="Edit"
                            style={{
                              padding: '6px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                              background: 'rgba(124,58,237,0.1)', color: 'var(--purple-light)',
                              display: 'flex', alignItems: 'center', transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
                          >
                            <HiPencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(client)}
                            title="Delete"
                            style={{
                              padding: '6px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                              background: 'rgba(248,113,113,0.1)', color: 'var(--red)',
                              display: 'flex', alignItems: 'center', transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                          >
                            <HiTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalClient !== undefined && (
        <ClientForm
          client={modalClient}
          onClose={() => setModalClient(undefined)}
        />
      )}

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1100,
              background: 'rgba(11,15,26,0.85)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '28px', maxWidth: '380px', width: '100%', textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🗑️</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Delete Client?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
                This will permanently delete <strong style={{ color: 'var(--text-primary)' }}>{deleteTarget.name}</strong>. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setDeleteTarget(null)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)',
                    color: 'var(--red)', cursor: deleting ? 'not-allowed' : 'pointer',
                    fontSize: '0.88rem', fontWeight: 600, opacity: deleting ? 0.7 : 1,
                  }}
                >
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
