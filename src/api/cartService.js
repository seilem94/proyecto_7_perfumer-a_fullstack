import axiosInstance from './axiosConfig';

export const cartService = {
  getCart: async () => {
    return await axiosInstance.get('/cart');
  },

  addToCart: async (perfumeId, quantity) => {
    return await axiosInstance.post('/cart/add', { perfumeId, quantity });
  },

  updateCartItem: async (perfumeId, quantity) => {
    return await axiosInstance.put(`/cart/update/${perfumeId}`, { quantity });
  },

  removeFromCart: async (perfumeId) => {
    return await axiosInstance.delete(`/cart/remove/${perfumeId}`);
  },

  clearCart: async () => {
    return await axiosInstance.delete('/cart/clear');
  },
};
