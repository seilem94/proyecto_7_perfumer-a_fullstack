export const Card = ({ children, className = '', hover = true }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-6 transition-shadow
        ${hover ? 'hover:shadow-lg' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
