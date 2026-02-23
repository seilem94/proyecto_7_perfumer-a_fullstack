import { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6rem',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: error ? '#8B4545' : 'var(--gold)',
        }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`input-luxury ${className}`}
        style={error ? { borderColor: '#8B4545' } : {}}
        {...props}
      />
      {error && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.72rem',
          color: '#8B4545',
          letterSpacing: '0.04em',
        }}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';