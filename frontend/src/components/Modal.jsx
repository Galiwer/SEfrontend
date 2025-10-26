import { useEffect } from 'react';

export default function Modal({ isOpen, title, children, onClose, footer }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={title || 'Dialog'}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'grid', placeItems: 'center', zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(680px, 92vw)', background: '#fff', borderRadius: 14,
          border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 18px 40px rgba(0,0,0,0.22)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</div>
        </div>
        <div style={{ padding: 16 }}>
          {children}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {footer}
        </div>
      </div>
    </div>
  );
}
