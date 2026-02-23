import { useState, useEffect, useCallback } from 'react';
import { productService } from '../api/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [filters, setFilters]   = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search:   '',
  });

  const fetchProducts = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getAllProducts(currentFilters);
      // Backend devuelve: { success, data: { perfumes: [...] } }
      const data = response.data?.data;
      const perfumes = data?.perfumes ?? data ?? [];
      setProducts(Array.isArray(perfumes) ? perfumes : []);
    } catch (err) {
      console.error('❌ Error al cargar productos:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(filters);
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.search, fetchProducts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ category: '', minPrice: '', maxPrice: '', search: '' });
  }, []);

  return { products, loading, error, filters, updateFilters, resetFilters };
};