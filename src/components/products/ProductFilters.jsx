import { CATEGORIES } from '../../utils/constants';

export const ProductFilters = ({ filters, updateFilters, resetFilters }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: e.target.search.value });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>
      
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio mínimo ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => updateFilters({ minPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio máximo ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="1000"
            value={filters.maxPrice}
            onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Buscar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            name="search"
            type="text"
            placeholder="Nombre o marca..."
            defaultValue={filters.search}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </form>

      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Buscar
        </button>
        <button
          onClick={resetFilters}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Filtros activos */}
      {Object.values(filters).some(Boolean) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Filtros activos: {Object.entries(filters)
              .filter(([k, v]) => v && k !== 'page')
              .map(([, v]) => v)
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};
