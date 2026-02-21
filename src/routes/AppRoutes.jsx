import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Products from "../pages/products/Products";
import Cart from "../pages/cart/Cart";

export const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/productos" element={<Products />} />
        <Route path="*" element={<Products />} />
        <Route path="/carrito" element={<Cart />} />
      </Routes>
    </MainLayout>
  );
};
