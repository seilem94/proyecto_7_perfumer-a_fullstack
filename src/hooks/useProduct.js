import { useState, useEffect, useCallback } from 'react';
import { productService } from '../api/productService';
import { ITEMS_PER_PAGE } from '../utils/constants';

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    page: 1,
    ...initialFilters,
  });
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async (page = filters.page) => {
    setLoading(true);
    setError(null);

    try {
      // Tu API devuelve { data: { perfumes: [...] } }
      const response = await productService.getAllProducts({
        ...filters,
        page,
      });

      setProducts(response.data.perfumes || response.data || []);
      setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts(1);
  }, [filters, fetchProducts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const goToPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      page: 1,
    });
  }, []);

  return {
    products,
    loading,
    error,
    filters,
    totalPages,
    updateFilters,
    goToPage,
    resetFilters,
  };
};
