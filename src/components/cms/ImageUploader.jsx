import { useState, useRef } from 'react';
import { HiTrash, HiRefresh, HiPhotograph } from 'react-icons/hi';

/**
 * ImageUploader — stores images as base64 in Firestore (no Firebase Storage needed).
 * Works immediately with zero Firebase Storage config or rules.
 * For large images, automatically compresses to stay under Firestore 1MB limit.
 */
export default function ImageUploader({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const compressAndConvert = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        // max 800px wide, maintain aspect ratio
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // compress to JPEG at 80% quality
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(base64);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };

      img.src = objectUrl;
    });
  };

  const upload = async (file) => {
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      // validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file (PNG, JPG, GIF, WebP)');
      }

      // validate size — max 5MB raw
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image too large. Please use an image under 5MB.');
      }

      const base64 = await compressAndConvert(file);
      onChange(base64);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    if (!window.confirm('Remove this image?')) return;
    onChange(null);
  };

  const lbl = {
    display: 'block', fontSize: '0.72rem', fontWeight: 600,
    color: 'var(--text-muted)', marginBottom: '8px',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  return (
    <div>
      {label && <label style={lbl}>{label}</label>}

      {value ? (
        <div style={{ display: 'inline-block', maxWidth: '100%' }}>
          <img
            src={value}
            alt="preview"
            style={{
              maxWidth: '100%', maxHeight: '200px', borderRadius: '10px',
              border: '1px solid var(--border)', display: 'block', objectFit: 'cover',
            }}
          />
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={btnStyle('rgba(124,58,237,0.12)', 'rgba(124,58,237,0.25)', '#a78bfa')}
            >
              <HiRefresh size={13} /> Replace
            </button>
            <button
              type="button"
              onClick={handleDelete}
              style={btnStyle('rgba(248,113,113,0.1)', 'rgba(248,113,113,0.25)', 'var(--red)')}
            >
              <HiTrash size={13} /> Delete
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          style={{
            border: '2px dashed var(--border)', borderRadius: '10px',
            padding: '32px 20px', textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: 'rgba(124,58,237,0.03)', transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => { if (!uploading) e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; }}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {uploading ? (
            <>
              <div style={{
                width: '32px', height: '32px',
                border: '3px solid rgba(124,58,237,0.2)',
                borderTop: '3px solid var(--purple)',
                borderRadius: '50%',
                animation: 'imgSpin 0.7s linear infinite',
                margin: '0 auto 10px',
              }} />
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Processing image...
              </p>
            </>
          ) : (
            <>
              <HiPhotograph style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: '10px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Click to upload image
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                PNG, JPG, GIF, WebP · Max 5MB · Any folder
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '8px', padding: '10px 14px', borderRadius: '8px',
          background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
          fontSize: '0.8rem', color: 'var(--red)', lineHeight: 1.5,
        }}>
          ⚠ {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files[0];
          if (file) upload(file);
          e.target.value = ''; // allow re-selecting same file
        }}
      />

      <style>{`@keyframes imgSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function btnStyle(bg, border, color) {
  return {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '6px 12px', borderRadius: '7px',
    border: `1px solid ${border}`, background: bg, color,
    cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
  };
}
