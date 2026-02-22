import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../store/useCartStore';
import { ROUTES, APP_NAME } from '../../utils/constants';

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <>
      {/* Barra superior decorativa */}
      <div
        style={{ backgroundColor: 'var(--espresso)', color: 'var(--champagne)' }}
        className="text-center py-2 text-xs tracking-widest uppercase font-light hidden sm:block"
      >
        Envío gratuito en compras sobre $150.000 CLP
      </div>

      <nav
        style={{
          backgroundColor: scrolled ? 'rgba(247, 243, 238, 0.96)' : 'var(--white)',
          borderBottom: `1px solid ${scrolled ? 'rgba(212,184,150,0.4)' : 'rgba(212,184,150,0.2)'}`,
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? 'var(--shadow-soft)' : 'none',
          transition: 'all 0.35s ease',
        }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex flex-col items-start leading-none"
              style={{ textDecoration: 'none' }}
            >
              <span
                className="text-display"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.625rem',
                  letterSpacing: '0.06em',
                  color: 'var(--espresso)',
                  fontWeight: 400,
                }}
              >
                {APP_NAME}
              </span>
              <span
                className="text-label"
                style={{ fontSize: '0.55rem', letterSpacing: '0.28em', marginTop: '-2px' }}
              >
                Haute Parfumerie
              </span>
            </Link>

            {/* ── Nav central (desktop) ── */}
            <div className="hidden md:flex items-center gap-10">
              <NavLink to={ROUTES.HOME} className={linkClass}>
                Inicio
              </NavLink>
              <NavLink to={ROUTES.PRODUCTS} className={linkClass}>
                Colección
              </NavLink>
              {isAdmin && (
                <NavLink to={ROUTES.ADMIN_DASHBOARD} className={linkClass}>
                  Admin
                </NavLink>
              )}
            </div>

            {/* ── Acciones derecha (desktop) ── */}
            <div className="hidden md:flex items-center gap-6">

              {/* Carrito */}
              <NavLink
                to={ROUTES.CART}
                className="relative flex flex-col items-center gap-0.5 group"
                style={{ textDecoration: 'none' }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ color: 'var(--stone)', transition: 'color 0.3s' }}
                  className="group-hover:[color:var(--gold)]"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {totalItems > 0 && (
                  <span
                    className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 text-white text-[9px] font-semibold rounded-full"
                    style={{ backgroundColor: 'var(--gold)', fontFamily: 'var(--font-body)' }}
                  >
                    {totalItems}
                  </span>
                )}
                <span
                  className="text-[9px] tracking-widest uppercase"
                  style={{ color: 'var(--stone-light)', fontFamily: 'var(--font-body)' }}
                >
                  Bolsa
                </span>
              </NavLink>

              {/* Separador */}
              <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--cream-dark)' }} />

              {/* Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-5">
                  <NavLink
                    to={ROUTES.PROFILE}
                    className="nav-link"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {user?.name?.split(' ')[0] || 'Mi cuenta'}
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="btn-outline-gold"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.65rem' }}
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <NavLink to={ROUTES.LOGIN} className={linkClass}>
                    Acceder
                  </NavLink>
                  <Link
                    to={ROUTES.REGISTER}
                    className="btn-gold"
                    style={{ padding: '0.55rem 1.5rem', fontSize: '0.65rem' }}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            {/* ── Botón móvil ── */}
            <div className="flex md:hidden items-center gap-4">
              <NavLink to={ROUTES.CART} className="relative" style={{ color: 'var(--stone)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {totalItems > 0 && (
                  <span
                    className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 text-white text-[9px] font-semibold rounded-full"
                    style={{ backgroundColor: 'var(--gold)' }}
                  >
                    {totalItems}
                  </span>
                )}
              </NavLink>

              <button
                onClick={() => setOpen(!open)}
                style={{ color: 'var(--charcoal)' }}
                className="p-1"
                aria-label="Menú"
              >
                {open ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Menú móvil ── */}
        {open && (
          <div
            style={{
              borderTop: '1px solid rgba(212,184,150,0.25)',
              backgroundColor: 'var(--white)',
            }}
            className="md:hidden"
          >
            <div className="px-6 py-6 space-y-5">
              {[
                { to: ROUTES.HOME, label: 'Inicio' },
                { to: ROUTES.PRODUCTS, label: 'Colección' },
                ...(isAdmin ? [{ to: ROUTES.ADMIN_DASHBOARD, label: 'Admin' }] : []),
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                  style={{ display: 'block', fontSize: '0.875rem' }}
                >
                  {label}
                </NavLink>
              ))}

              <div style={{ borderTop: '1px solid rgba(212,184,150,0.2)', paddingTop: '1.25rem' }}>
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--stone)', letterSpacing: '0.1em' }}>
                      Hola, <span style={{ color: 'var(--espresso)', fontWeight: 500 }}>{user?.name}</span>
                    </p>
                    <button onClick={handleLogout} className="btn-outline-gold w-full">
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <NavLink to={ROUTES.LOGIN} onClick={() => setOpen(false)} className="btn-ghost w-full block text-center">
                      Acceder
                    </NavLink>
                    <Link to={ROUTES.REGISTER} onClick={() => setOpen(false)} className="btn-gold w-full block text-center">
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};