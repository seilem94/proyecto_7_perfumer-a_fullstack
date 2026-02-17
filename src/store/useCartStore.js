import { create } from 'zustand';
import { cartService } from '../api/cartService';
import { STORAGE_KEYS } from '../utils/constants';

export const useCartStore = create((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  isGuest: true,

  // Cargar carrito desde localStorage (invitados) o backend (usuarios)
  initializeCart: async (isAuthenticated) => {
    if (isAuthenticated) {
      await get().fetchCartFromBackend();
    } else {
      get().loadGuestCart();
    }
  },

  // Cargar carrito de invitado desde localStorage
  loadGuestCart: () => {
    const savedCart = localStorage.getItem(STORAGE_KEYS.GUEST_CART);
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      set({ 
        items: cart.items || [],
        totalItems: cart.totalItems || 0,
        totalPrice: cart.totalPrice || 0,
        isGuest: true,
      });
    }
  },

  // Guardar carrito de invitado en localStorage
  saveGuestCart: () => {
    const { items, totalItems, totalPrice } = get();
    localStorage.setItem(
      STORAGE_KEYS.GUEST_CART,
      JSON.stringify({ items, totalItems, totalPrice })
    );
  },

  // Obtener carrito desde backend (usuarios autenticados)
  fetchCartFromBackend: async () => {
    set({ loading: true });
    try {
      const response = await cartService.getCart();
      set({
        items: response.data.items || [],
        totalItems: response.data.totalItems || 0,
        totalPrice: response.data.totalPrice || 0,
        isGuest: false,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.error('Error al cargar carrito:', error);
    }
  },

  // Agregar producto al carrito
  addItem: async (product, quantity = 1) => {
    const { isGuest, items } = get();

    if (isGuest) {
      // Carrito de invitado (localStorage)
      const existingItem = items.find(item => item.perfume._id === product._id);
      
      let updatedItems;
      if (existingItem) {
        updatedItems = items.map(item =>
          item.perfume._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...items, { perfume: product, quantity, price: product.price }];
      }

      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      set({
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      });

      get().saveGuestCart();
    } else {
      // Usuario autenticado (backend)
      try {
        await cartService.addToCart(product._id, quantity);
        await get().fetchCartFromBackend();
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  // Actualizar cantidad de un producto
  updateItemQuantity: async (perfumeId, quantity) => {
    const { isGuest, items } = get();

    if (quantity <= 0) {
      return get().removeItem(perfumeId);
    }

    if (isGuest) {
      const updatedItems = items.map(item =>
        item.perfume._id === perfumeId
          ? { ...item, quantity }
          : item
      );

      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      set({
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      });

      get().saveGuestCart();
    } else {
      try {
        await cartService.updateCartItem(perfumeId, quantity);
        await get().fetchCartFromBackend();
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  // Eliminar producto del carrito
  removeItem: async (perfumeId) => {
    const { isGuest, items } = get();

    if (isGuest) {
      const updatedItems = items.filter(item => item.perfume._id !== perfumeId);
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      set({
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      });

      get().saveGuestCart();
    } else {
      try {
        await cartService.removeFromCart(perfumeId);
        await get().fetchCartFromBackend();
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  // Vaciar carrito
  clearCart: async () => {
    const { isGuest } = get();

    if (isGuest) {
      set({ items: [], totalItems: 0, totalPrice: 0 });
      localStorage.removeItem(STORAGE_KEYS.GUEST_CART);
    } else {
      try {
        await cartService.clearCart();
        set({ items: [], totalItems: 0, totalPrice: 0 });
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  // Migrar carrito de invitado a usuario autenticado
  migrateGuestCart: async () => {
    const { items, isGuest } = get();

    if (!isGuest || items.length === 0) return;

    try {
      // Agregar cada item del carrito de invitado al backend
      for (const item of items) {
        await cartService.addToCart(item.perfume._id, item.quantity);
      }

      // Limpiar localStorage y cargar desde backend
      localStorage.removeItem(STORAGE_KEYS.GUEST_CART);
      await get().fetchCartFromBackend();
    } catch (error) {
      console.error('Error al migrar carrito:', error);
    }
  },
}));
