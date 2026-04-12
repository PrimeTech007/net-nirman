import ImageUploader from './ImageUploader';
import { HiPlus, HiTrash } from 'react-icons/hi';

/* shared styles */
const lbl = {
  display: 'block', fontSize: '0.72rem', fontWeight: 600,
  color: 'var(--text-muted)', marginBottom: '6px',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};

const inp = (multiline) => ({
  width: '100%',
  padding: multiline ? '10px 14px' : '9px 14px',
  background: 'rgba(124,58,237,0.05)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontSize: '0.88rem',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  resize: multiline ? 'vertical' : 'none',
  lineHeight: 1.5,
});

function humanLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, s => s.toUpperCase())
    .trim();
}

function isImageKey(key) {
  return ['image', 'avatar', 'photo', 'logo', 'thumbnail', 'img', 'picture'].some(k =>
    key.toLowerCase().includes(k)
  );
}

function isLongText(key) {
  return ['description', 'bio', 'content', 'paragraph', 'subtext', 'subtitle', 'text', 'benefit'].some(k =>
    key.toLowerCase().includes(k)
  );
}

function isBoolean(val) {
  return typeof val === 'boolean';
}

function isUrl(key) {
  return ['url', 'link', 'href', 'src'].some(k => key.toLowerCase().includes(k));
}

/* ── Primitive field ── */
function PrimitiveField({ fieldKey, value, onChange, sectionKey }) {
  if (isImageKey(fieldKey)) {
    return (
      <ImageUploader
        label={humanLabel(fieldKey)}
        value={value}
        onChange={onChange}
      />
    );
  }

  if (isBoolean(value)) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{ ...lbl, margin: 0 }}>{humanLabel(fieldKey)}</label>
        <div
          onClick={() => onChange(!value)}
          style={{
            width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer',
            background: value ? 'var(--purple)' : 'rgba(255,255,255,0.1)',
            position: 'relative', transition: 'background 0.2s', flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute', top: '3px',
            left: value ? '21px' : '3px',
            width: '16px', height: '16px', borderRadius: '50%',
            background: 'white', transition: 'left 0.2s',
          }} />
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{value ? 'On' : 'Off'}</span>
      </div>
    );
  }

  const isLong = isLongText(fieldKey);
  return (
    <div>
      <label style={lbl}>{humanLabel(fieldKey)}</label>
      {isLong ? (
        <textarea
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          rows={3}
          style={inp(true)}
        />
      ) : (
        <input
          type={isUrl(fieldKey) ? 'url' : 'text'}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          style={inp(false)}
        />
      )}
    </div>
  );
}

/* ── Object field (nested) ── */
function ObjectField({ fieldKey, value, onChange, sectionKey }) {
  const update = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div style={{
      border: '1px solid rgba(124,58,237,0.15)', borderRadius: '10px',
      padding: '16px', background: 'rgba(124,58,237,0.03)',
    }}>
      <p style={{ ...lbl, marginBottom: '12px', color: 'rgba(167,139,250,0.8)' }}>{humanLabel(fieldKey)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.entries(value).map(([k, v]) => (
          <FieldRenderer key={k} fieldKey={k} value={v} onChange={nv => update(k, nv)} sectionKey={sectionKey} />
        ))}
      </div>
    </div>
  );
}

/* ── Array field ── */
function ArrayField({ fieldKey, value, onChange, sectionKey }) {
  const arr = Array.isArray(value) ? value : [];

  const updateItem = (i, newVal) => {
    const next = [...arr];
    next[i] = newVal;
    onChange(next);
  };

  const addItem = () => {
    const template = arr.length > 0
      ? JSON.parse(JSON.stringify(arr[arr.length - 1]))
      : (typeof arr[0] === 'string' ? '' : {});
    // clear values for new item
    if (typeof template === 'object' && template !== null) {
      Object.keys(template).forEach(k => {
        if (typeof template[k] === 'string') template[k] = '';
        if (typeof template[k] === 'boolean') template[k] = false;
        if (typeof template[k] === 'number') template[k] = 0;
        if (Array.isArray(template[k])) template[k] = [];
      });
    }
    onChange([...arr, template]);
  };

  const removeItem = (i) => {
    if (!window.confirm('Remove this item?')) return;
    onChange(arr.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ ...lbl, margin: 0 }}>{humanLabel(fieldKey)}</label>
        <button
          type="button"
          onClick={addItem}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
            color: '#22c55e', cursor: 'pointer',
          }}
        >
          <HiPlus size={12} /> Add
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {arr.map((item, i) => (
          <div key={i} style={{
            border: '1px solid var(--border)', borderRadius: '10px',
            padding: '14px', background: 'rgba(255,255,255,0.02)', position: 'relative',
          }}>
            <button
              type="button"
              onClick={() => removeItem(i)}
              style={{
                position: 'absolute', top: '10px', right: '10px',
                padding: '4px', borderRadius: '5px', border: 'none',
                background: 'rgba(248,113,113,0.1)', color: 'var(--red)',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
              }}
            >
              <HiTrash size={13} />
            </button>

            {typeof item === 'string' ? (
              <textarea
                value={item}
                onChange={e => updateItem(i, e.target.value)}
                rows={2}
                style={{ ...inp(true), paddingRight: '36px' }}
              />
            ) : typeof item === 'object' && item !== null ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '28px' }}>
                {Object.entries(item).map(([k, v]) => (
                  <FieldRenderer
                    key={k}
                    fieldKey={k}
                    value={v}
                    onChange={nv => updateItem(i, { ...item, [k]: nv })}
                    sectionKey={sectionKey}
                  />
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={item ?? ''}
                onChange={e => updateItem(i, e.target.value)}
                style={inp(false)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main dispatcher ── */
export default function FieldRenderer({ fieldKey, value, onChange, sectionKey }) {
  if (Array.isArray(value)) {
    return <ArrayField fieldKey={fieldKey} value={value} onChange={onChange} sectionKey={sectionKey} />;
  }
  if (value !== null && typeof value === 'object') {
    return <ObjectField fieldKey={fieldKey} value={value} onChange={onChange} sectionKey={sectionKey} />;
  }
  return <PrimitiveField fieldKey={fieldKey} value={value} onChange={onChange} sectionKey={sectionKey} />;
}
