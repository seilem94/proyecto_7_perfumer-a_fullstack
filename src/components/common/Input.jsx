export const Input = ({ 
  label, 
  error, 
  type = 'text',
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-4 py-2 border rounded-lg outline-none transition-all
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
          } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
