import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';
import { MainLayout } from '../components/layout/MainLayout';

import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Products from '../pages/products/Products';
import ProductDetail from '../pages/products/ProductDetail';
import Cart from '../pages/cart/Cart';
import Profile from '../pages/profile/Profile';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminCreateProduct from '../pages/admin/AdminCreateProduct';

export const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.PRODUCTS} element={<Products />} />
        <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />

        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.CART} element={<Cart />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminProducts />} />
          <Route
            path={ROUTES.ADMIN_CREATE_PRODUCT}
            element={<AdminCreateProduct />}
          />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </MainLayout>
  );
};
