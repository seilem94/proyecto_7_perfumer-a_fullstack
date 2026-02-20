import { useProducts } from '../../hooks/useProducts';
import { ProductFilters } from '../../components/products/ProductFilters';
import { ProductCard } from '../../components/products/ProductCard';
import { Card } from '../../components/common/Card';

export default function Products() {
  const {
    products,
    loading,
    filters,
    totalPages,
    updateFilters,
    goToPage,
    resetFilters,
  } = useProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Catálogo de Perfumes
        </h1>
        <p className="text-gray-600">
          Encuentra el perfume perfecto para ti ({products.length} productos)
        </p>
      </div>

      <ProductFilters
        filters={filters}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
      />

      {products.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg
                className="h-full w-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-4V7m8 4H4m12 0H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500 mb-4">
              Intenta ajustar los filtros o limpiar la búsqueda.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Limpiar filtros
            </button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => goToPage(filters.page - 1)}
                disabled={filters.page <= 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      filters.page === page
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(filters.page + 1)}
                disabled={filters.page >= totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
