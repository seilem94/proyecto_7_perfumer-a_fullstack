export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_VERSION = import.meta.env.VITE_API_VERSION;
export const APP_NAME = import.meta.env.VITE_APP_NAME;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/productos',
  PRODUCT_DETAIL: '/productos/:id',
  CART: '/carrito',
  PROFILE: '/perfil',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/productos',
  ADMIN_CREATE_PRODUCT: '/admin/productos/crear',
};

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const CATEGORIES = ['Hombre', 'Mujer', 'Unisex'];

export const ITEMS_PER_PAGE = 12;

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  GUEST_CART: 'guest_cart',
};
