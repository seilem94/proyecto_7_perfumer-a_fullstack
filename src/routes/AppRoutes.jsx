import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';
import AdminUsers from '../pages/admin/AdminUsers';

// Páginas públicas
import Home from '../pages/Home';
import Products from '../pages/products/Products';
import ProductDetail from '../pages/products/ProductDetail';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Páginas protegidas
import Cart from '../pages/cart/Cart';
import Checkout from '../pages/checkout/Checkout';
import Profile from '../pages/profile/Profile';

// Admin
import AdminPanel from '../pages/admin/AdminPanel';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminCreateProduct from '../pages/admin/AdminCreateProduct';

export const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        {/* ── Públicas ── */}
        <Route path="/"             element={<Home />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/productos"    element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/carrito"   element={<Cart />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        
        {/* ── Protegidas (usuario autenticado) ── */}
        <Route element={<PrivateRoute />}>        
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/perfil"   element={<Profile />} />
        </Route>

        {/* ── Admin (JWT + rol admin) ── */}
        <Route element={<AdminRoute />}>
          <Route path="/admin"                      element={<AdminPanel />} />
          <Route path="/admin/productos"            element={<AdminProducts />} />
          <Route path="/admin/productos/crear"      element={<AdminCreateProduct />} />
          <Route path="/admin/productos/editar/:id" element={<AdminCreateProduct />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Home />} />
      </Routes>
    </MainLayout>
  );
};