import { create } from 'zustand';
import { cartService } from '../api/cartService';
import { STORAGE_KEYS } from '../utils/constants';

export const useCartStore = create((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  isGuest: true,

  initializeCart: async (isAuthenticated) => {
    if (isAuthenticated) {
      await get().fetchCartFromBackend();
    } else {
      get().loadGuestCart();
    }
  },

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

  saveGuestCart: () => {
    const { items, totalItems, totalPrice } = get();
    localStorage.setItem(
      STORAGE_KEYS.GUEST_CART,
      JSON.stringify({ items, totalItems, totalPrice })
    );
  },

  // GET /cart devuelve: { success: true, data: { items, totalItems, totalPrice, ... } }
  fetchCartFromBackend: async () => {
    set({ loading: true });
    try {
      const response = await cartService.getCart();

      // Un solo nivel de data: response.data.data
      const cartData = response.data.data;

      set({
        items: cartData.items || [],
        totalItems: cartData.totalItems || 0,
        totalPrice: cartData.totalPrice || 0,
        isGuest: false,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.error('Error al cargar carrito:', error);
    }
  },

  addItem: async (product, quantity = 1) => {
    const { isGuest, items } = get();

    if (isGuest) {
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

      set({ items: updatedItems, totalItems: newTotalItems, totalPrice: newTotalPrice });
      get().saveGuestCart();
    } else {
      // POST /cart/add espera: { perfumeId, quantity }
      try {
        await cartService.addToCart(product._id, quantity);
        await get().fetchCartFromBackend();
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  updateItemQuantity: async (perfumeId, quantity) => {
    const { isGuest, items } = get();

    if (quantity <= 0) return get().removeItem(perfumeId);

    if (isGuest) {
      const updatedItems = items.map(item =>
        item.perfume._id === perfumeId ? { ...item, quantity } : item
      );
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      set({ items: updatedItems, totalItems: newTotalItems, totalPrice: newTotalPrice });
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

  removeItem: async (perfumeId) => {
    const { isGuest, items } = get();

    if (isGuest) {
      const updatedItems = items.filter(item => item.perfume._id !== perfumeId);
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      set({ items: updatedItems, totalItems: newTotalItems, totalPrice: newTotalPrice });
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

  // Migrar carrito invitado → backend tras login
  migrateGuestCart: async () => {
    const { items } = get();
    const guestItems = [...items]; // copia antes de limpiar estado

    // Marcar autenticado antes de cualquier llamada al backend
    set({ isGuest: false });

    if (guestItems.length === 0) {
      await get().fetchCartFromBackend();
      return;
    }

    try {
      for (const item of guestItems) {
        await cartService.addToCart(item.perfume._id, item.quantity);
      }
      localStorage.removeItem(STORAGE_KEYS.GUEST_CART);
      await get().fetchCartFromBackend();
    } catch (error) {
      console.error('Error al migrar carrito:', error);
      // Aunque falle la migración, cargar lo que haya en el backend
      localStorage.removeItem(STORAGE_KEYS.GUEST_CART);
      await get().fetchCartFromBackend();
    }
  },
}));