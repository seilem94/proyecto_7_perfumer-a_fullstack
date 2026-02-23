import axiosInstance from './axiosConfig';

export const authService = {
  register: async (userData) => {
    return await axiosInstance.post('/users/register', userData);
  },

  login: async (credentials) => {
    return await axiosInstance.post('/users/login', credentials);
  },

  verifyToken: async () => {
    return await axiosInstance.get('/users/verifytoken');
  },

  updateProfile: async (userData) => {
    return await axiosInstance.put('/users/update', userData);
  },
};
