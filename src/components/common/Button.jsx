export const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  size = 'md',
  ...props
}) => {
  const variants = {
    primary:   'btn-gold',
    outline:   'btn-outline-gold',
    secondary: 'btn-ghost',
    danger:    'inline-flex items-center justify-center px-6 py-3 bg-red-700 text-white font-body text-xs font-medium tracking-widest uppercase transition-all hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed',
  };

  const sizes = {
    sm:  'text-xs py-2 px-4',
    md:  '',
    lg:  'text-sm py-4 px-8',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};