import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../store/useCartStore';

export const MainLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { initializeCart, migrateGuestCart } = useCartStore();

  useEffect(() => {
    if (!loading) {
      initializeCart(isAuthenticated);
      if (isAuthenticated) {
        migrateGuestCart();
      }
    }
  }, [isAuthenticated, loading, initializeCart, migrateGuestCart]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
      </main>
      <footer className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Perfumería Elegance. Todos los derechos reservados.
      </footer>
    </div>
  );
};
