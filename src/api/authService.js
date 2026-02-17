import axiosInstance from './axiosConfig';

export const authService = {
  register: async (userData) => {
    return await axiosInstance.post('/user/register', userData);
  },

  login: async (credentials) => {
    return await axiosInstance.post('/user/login', credentials);
  },

  verifyToken: async () => {
    return await axiosInstance.get('/user/verifytoken');
  },

  updateProfile: async (userData) => {
    return await axiosInstance.put('/user/update', userData);
  },
};
