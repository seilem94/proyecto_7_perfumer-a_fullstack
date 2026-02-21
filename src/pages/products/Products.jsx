import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { ProductFilters } from '../../components/products/ProductFilters';
import { ProductCard } from '../../components/products/ProductCard';
import { Card } from '../../components/common/Card';

export default function Products() {
  const {
    products,
    loading,
    filters,
    updateFilters,
    resetFilters,
  } = useProducts();

  // Mock fallback si API no responde
  const mockProducts = [
    {
      _id: 'mock1',
      name: 'Chanel No. 5',
      brand: 'Chanel',
      description: 'Fragancia floral clásica',
      price: 150000,
      stock: 25,
      category: 'Mujer',
      image: 'https://images.unsplash.com/photo-1611598060465-6efd9706d5cd?w=300&h=300&fit=crop'
    },
    {
      _id: 'mock2',
      name: 'Dior Sauvage',
      brand: 'Dior',
      description: 'Fresca y amaderada',
      price: 120000,
      stock: 30,
      category: 'Hombre',
      image: 'https://images.unsplash.com/photo-1587014611670-7f7d815cff43?w=300&h=300&fit=crop'
    },
    {
      _id: 'mock3',
      name: 'Versace Eros',
      brand: 'Versace',
      description: 'Oriental fougère seductor',
      price: 95000,
      stock: 15,
      category: 'Hombre',
      image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=300&h=300&fit=crop'
    },
    {
      _id: 'mock4',
      name: 'Yves Saint Laurent Libre',
      brand: 'YSL',
      description: 'Floral amaderado moderno',
      price: 135000,
      stock: 20,
      category: 'Mujer',
      image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=300&h=300&fit=crop'
    }
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-600">Cargando perfumes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Catálogo de Perfumes
        </h1>
        <p className="text-xl text-gray-600">
          {displayProducts.length} fragancias exclusivas encontradas
        </p>
      </div>

      {/* Filtros */}
      <ProductFilters
        filters={filters}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
      />

      {/* Resultados */}
      {displayProducts.length === 0 ? (
        <Card className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🛍️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No se encontraron perfumes
          </h3>
          <p className="text-gray-500 mb-6">
            Prueba ajustar los filtros o limpiar la búsqueda
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Limpiar filtros
          </button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Paginación simple */}
          <div className="flex items-center justify-center space-x-2 text-sm">
            <span className="text-gray-700 font-medium">
              Mostrando 1-{Math.min(16, displayProducts.length)} de {displayProducts.length}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
