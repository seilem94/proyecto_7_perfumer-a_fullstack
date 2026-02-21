import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { PrivateRoute } from "./PrivateRoute";
import { AdminRoute } from "./AdminRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Products from "../pages/products/Products";
import Cart from "../pages/cart/Cart";
import ProductDetail from "../pages/products/ProductDetail";
import AdminPanel from "../pages/admin/AdminPanel"; // descomentar cuando esté listo

export const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        
        {/* Protegidas (usuario autenticado) */}
        <Route element={<PrivateRoute />}>
          <Route path="/carrito" element={<Cart />} />
        </Route>

        {/* Protegidas (solo admin) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Products />} />
      </Routes>
    </MainLayout>
  );
};
