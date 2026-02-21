import { CATEGORIES } from '../../utils/constants';

export const ProductFilters = ({ filters, updateFilters, resetFilters }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Todas</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio mínimo
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => updateFilters({ minPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio máximo
          </label>
          <input
            type="number"
            min="0"
            placeholder="1.000.000"
            value={filters.maxPrice}
            onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Búsqueda — ahora controlado con value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Nombre o marca..."
            value={filters.search}          // ← era defaultValue, aquí estaba el bug
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={resetFilters}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
        >
          🧹 Limpiar filtros
        </button>
      </div>
    </div>
  );
};