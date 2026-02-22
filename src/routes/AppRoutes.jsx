import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { PrivateRoute } from "./PrivateRoute";
import { AdminRoute } from "./AdminRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home";
import Products from "../pages/products/Products";
import ProductDetail from "../pages/products/ProductDetail";
import Cart from "../pages/cart/Cart";
import AdminPanel from "../pages/admin/AdminPanel";

export const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<ProductDetail />} />

        {/* Protegidas (usuario autenticado) */}
        <Route element={<PrivateRoute />}>
          <Route path="/carrito" element={<Cart />} />
        </Route>

        {/* Protegidas (solo admin) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </MainLayout>
  );
};