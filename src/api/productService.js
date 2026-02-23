import axiosInstance from './axiosConfig';
import { ITEMS_PER_PAGE } from '../utils/constants';

export const productService = {
  getAllProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice)  params.append('minPrice', filters.minPrice);
    if (filters.maxPrice)  params.append('maxPrice', filters.maxPrice);
    if (filters.search)    params.append('search', filters.search);
    if (filters.page)      params.append('page', filters.page);
    if (filters.limit)     params.append('limit', filters.limit || ITEMS_PER_PAGE);
    return await axiosInstance.get(`/perfumes/readall?${params.toString()}`);
  },

  getProductById: async (id) => {
    return await axiosInstance.get(`/perfumes/readone/${id}`);
  },

  createProduct: async (productData) => {
    return await axiosInstance.post('/perfumes/create', productData);
  },

  updateProduct: async (id, productData) => {
    return await axiosInstance.put(`/perfumes/update/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await axiosInstance.delete(`/perfumes/delete/${id}`);
  },
};