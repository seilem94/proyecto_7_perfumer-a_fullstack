import { useState, useEffect, useCallback, useMemo } from 'react';
import { productService } from '../api/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  const fetchProducts = useCallback(async (currentFilters) => {
    console.log('🔍 Fetching with:', currentFilters);
    setLoading(true);
    setError(null);

    try {
      const response = await productService.getAllProducts(currentFilters);
      console.log('✅ API response:', response);
      setProducts(response.data.perfumes || response.data || []);
    } catch (err) {
      console.error('❌ API error:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Solo fetch cuando cambian filtros "importantes"
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(filters);
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.search, fetchProducts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
    });
  }, []);

  return {
    products,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
  };
};
