import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../store/useCartStore';
import { ROUTES, APP_NAME } from '../../utils/constants';

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-purple-100 text-purple-700'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + navegación izquierda */}
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <span className="font-bold text-lg text-gray-900">
                  {APP_NAME}
                </span>
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
              <NavLink to={ROUTES.HOME} className={navLinkClass}>
                Inicio
              </NavLink>
              <NavLink to={ROUTES.PRODUCTS} className={navLinkClass}>
                Perfumes
              </NavLink>
              {isAdmin && (
                <NavLink to={ROUTES.ADMIN_DASHBOARD} className={navLinkClass}>
                  Admin
                </NavLink>
              )}
            </div>
          </div>

          {/* Navegación derecha */}
          <div className="hidden sm:flex sm:items-center sm:space-x-3">
            <NavLink
              to={ROUTES.CART}
              className="relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <span className="material-icons-outlined text-base mr-1">shopping_bag</span>
              Carrito
              {totalItems > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-purple-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to={ROUTES.PROFILE}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  {user?.name || 'Perfil'}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink to={ROUTES.LOGIN} className={navLinkClass}>
                  Iniciar sesión
                </NavLink>
                <NavLink
                  to={ROUTES.REGISTER}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  Registrarse
                </NavLink>
              </>
            )}
          </div>

          {/* Botón móvil */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <span className="sr-only">Abrir menú</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to={ROUTES.HOME} className={navLinkClass} onClick={() => setOpen(false)}>
              Inicio
            </NavLink>
            <NavLink
              to={ROUTES.PRODUCTS}
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Perfumes
            </NavLink>
            {isAdmin && (
              <NavLink
                to={ROUTES.ADMIN_DASHBOARD}
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Admin
              </NavLink>
            )}
            <NavLink
              to={ROUTES.CART}
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Carrito ({totalItems})
            </NavLink>
          </div>
          <div className="px-4 pt-2 pb-3 border-t border-gray-200 space-y-2">
            {isAuthenticated ? (
              <>
                <p className="text-sm text-gray-600">Hola, {user?.name}</p>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to={ROUTES.LOGIN}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setOpen(false)}
                >
                  Iniciar sesión
                </NavLink>
                <NavLink
                  to={ROUTES.REGISTER}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 text-center"
                  onClick={() => setOpen(false)}
                >
                  Registrarse
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
