export const Card = ({ children, className = '', hover = true }) => {
  return (
    <div className={`card-luxury ${hover ? '' : '![transform:none] ![box-shadow:var(--shadow-soft)]'} ${className}`}>
      {children}
    </div>
  );
};