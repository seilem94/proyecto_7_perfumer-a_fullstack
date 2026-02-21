import { CATEGORIES } from '../../utils/constants';

export const ProductFilters = ({ filters, updateFilters, resetFilters }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateFilters({ 
      search: formData.get('search') || '',
      category: formData.get('category') || '',
      minPrice: formData.get('minPrice') || '',
      maxPrice: formData.get('maxPrice') || '',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>
      
      <form id="filters-form" onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select
            name="category"
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Todas</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mínimo</label>
          <input
            name="minPrice"
            type="number"
            min="0"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => updateFilters({ minPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Máximo</label>
          <input
            name="maxPrice"
            type="number"
            min="0"
            placeholder="1000000"
            value={filters.maxPrice}
            onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <input
            name="search"
            type="text"
            placeholder="Nombre o marca..."
            defaultValue={filters.search}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </form>

      <div className="flex gap-3">
        <button
          type="submit"
          form="filters-form"
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
        >
          🔍 Buscar
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
        >
          🧹 Limpiar
        </button>
      </div>
    </div>
  );
};
