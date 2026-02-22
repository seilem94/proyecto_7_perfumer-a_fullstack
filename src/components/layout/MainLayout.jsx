import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../store/useCartStore';
import { ROUTES } from '../../utils/constants';

export const MainLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { initializeCart, migrateGuestCart } = useCartStore();

  useEffect(() => {
    if (!loading) {
      initializeCart(isAuthenticated);
      if (isAuthenticated) migrateGuestCart();
    }
  }, [isAuthenticated, loading, initializeCart, migrateGuestCart]);

  return (
    <div className="min-h-screen flex flex-col bg-texture">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          {children}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: 'var(--espresso)', color: 'var(--stone-light)' }}>
        {/* Franja dorada superior */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

            {/* Columna 1: Marca */}
            <div className="space-y-4">
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    color: 'var(--champagne)',
                    fontWeight: 400,
                    letterSpacing: '0.06em',
                  }}
                >
                  Elegance
                </h3>
                <div className="gold-line mt-2" />
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  lineHeight: 1.9,
                  fontWeight: 300,
                  color: 'var(--stone-light)',
                }}
              >
                Fragancias de autor y perfumes de alta gama seleccionados para quienes aprecian lo extraordinario.
              </p>
            </div>

            {/* Columna 2: Navegación */}
            <div className="space-y-4">
              <h4 className="text-label" style={{ color: 'var(--gold)' }}>Explorar</h4>
              <nav className="space-y-3">
                {[
                  { to: ROUTES.HOME, label: 'Inicio' },
                  { to: ROUTES.PRODUCTS, label: 'Colección completa' },
                  { to: ROUTES.CART, label: 'Mi bolsa' },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      fontWeight: 300,
                      color: 'var(--stone-light)',
                      letterSpacing: '0.05em',
                      transition: 'color 0.3s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--champagne)'}
                    onMouseLeave={e => e.target.style.color = 'var(--stone-light)'}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Columna 3: Contacto */}
            <div className="space-y-4">
              <h4 className="text-label" style={{ color: 'var(--gold)' }}>Contacto</h4>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  fontWeight: 300,
                  color: 'var(--stone-light)',
                  lineHeight: 2,
                }}
              >
                <p>Santiago, Chile</p>
                <p>contacto@elegance.cl</p>
                <p>+56 9 0000 0000</p>
              </div>
            </div>
          </div>

          {/* Divisor */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,184,150,0.25), transparent)', marginBottom: '1.5rem' }} />

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                color: 'var(--stone)',
              }}
            >
              © {new Date().getFullYear()} Elegance Haute Parfumerie. Todos los derechos reservados.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: '0.875rem',
                color: 'var(--gold)',
                opacity: 0.7,
              }}
            >
              L'art de sentir bon.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};