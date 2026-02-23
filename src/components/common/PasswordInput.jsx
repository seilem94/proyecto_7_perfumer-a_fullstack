import { forwardRef, useState } from 'react';

// ── Ícono ojo ────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// ── Medidor de seguridad ─────────────────────────────────────────────────────
const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: 'transparent' };

  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Muy débil',  color: '#8B4545' };
  if (score === 2) return { score: 2, label: 'Débil',      color: '#B8722A' };
  if (score === 3) return { score: 3, label: 'Regular',    color: 'var(--gold-dark)' };
  if (score === 4) return { score: 4, label: 'Fuerte',     color: '#6B8F6B' };
  return               { score: 5, label: 'Muy fuerte', color: '#3A6B3A' };
};

// ── PasswordInput ────────────────────────────────────────────────────────────
export const PasswordInput = forwardRef(({
  label,
  error,
  showStrength = false,  // activar medidor
  watchValue = '',       // valor actual para calcular strength
  className = '',
  ...props
}, ref) => {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? getStrength(watchValue) : null;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label style={{
          fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 500,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: error ? '#8B4545' : 'var(--gold)',
        }}>
          {label}
        </label>
      )}

      {/* Input + botón toggle */}
      <div className="relative">
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={`input-luxury ${className}`}
          style={{
            paddingRight: '2.75rem',
            borderColor: error ? '#8B4545' : undefined,
          }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          tabIndex={-1}
          style={{
            position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: visible ? 'var(--gold)' : 'var(--stone-light)',
            transition: 'color 0.3s', padding: '0.25rem',
          }}
          aria-label={visible ? 'Ocultar contraseña' : 'Ver contraseña'}
        >
          <EyeIcon open={visible} />
        </button>
      </div>

      {/* Medidor de seguridad */}
      {showStrength && watchValue && (
        <div className="space-y-1.5 mt-1">
          {/* Barras */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                style={{
                  flex: 1, height: '3px',
                  backgroundColor: i <= strength.score ? strength.color : 'rgba(212,184,150,0.25)',
                  transition: 'background-color 0.4s ease',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>
          {/* Label */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.68rem',
            color: strength.color, transition: 'color 0.4s',
          }}>
            {strength.label}
            {strength.score < 3 && (
              <span style={{ color: 'var(--stone-light)', marginLeft: '0.5rem' }}>
                — usa mayúsculas, números y símbolos
              </span>
            )}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#8B4545' }}>
          {error}
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';