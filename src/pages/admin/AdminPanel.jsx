import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../api/productService';
import { formatPrice } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, sub, icon }) => (
  <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', boxShadow: 'var(--shadow-soft)', padding: '1.75rem' }}>
    <div className="flex items-start justify-between mb-3">
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--stone)' }}>{label}</p>
      <span style={{ color: 'var(--champagne)' }}>{icon}</span>
    </div>
    <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 300, color: 'var(--espresso)', lineHeight: 1, marginBottom: '0.4rem' }}>{value}</p>
    {sub && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--stone-light)' }}>{sub}</p>}
  </div>
);

const QuickLink = ({ to, label, desc, icon }) => (
  <Link to={to} style={{ display: 'block', textDecoration: 'none', padding: '1.5rem', backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', boxShadow: 'var(--shadow-soft)', transition: 'all 0.35s' }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,151,90,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-medium)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,184,150,0.22)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-soft)'; }}
  >
    <div className="flex items-center gap-4">
      <div style={{ width: '44px', height: '44px', border: '1px solid rgba(184,151,90,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '0.2rem' }}>{label}</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 300, color: 'var(--stone)' }}>{desc}</p>
      </div>
      <svg className="ml-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--stone-light)', flexShrink: 0 }}>
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </div>
  </Link>
);

export default function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await productService.getAllProducts();
        const products = res.data?.perfumes || res.data || [];
        const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
        setStats({
          total: products.length,
          inStock: products.filter(p => p.stock > 0).length,
          lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
          outOfStock: products.filter(p => p.stock === 0).length,
          totalValue,
        });
        setRecentProducts(products.slice(0, 5));
      } catch { setStats(null); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-12">
        <span className="text-label block mb-2">Panel de control</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: 'var(--espresso)' }}>
          Bienvenido, {user?.name?.split(' ')[0]}
        </h1>
        <div className="gold-line mt-3" />
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--champagne)', borderTopColor: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <StatCard label="Total productos" value={stats?.total ?? '—'} sub="En el catálogo"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>} />
            <StatCard label="En stock" value={stats?.inStock ?? '—'} sub="Disponibles para venta"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
            <StatCard label="Stock bajo" value={stats?.lowStock ?? '—'} sub="Menos de 10 unidades"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
            <StatCard label="Valor inventario" value={stats ? formatPrice(stats.totalValue) : '—'} sub="Precio × stock total"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} />
          </div>

          {/* Accesos rápidos */}
          <div className="mb-10">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '1rem' }}>Acciones rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickLink to="/admin/productos/crear" label="Agregar perfume" desc="Crear un nuevo producto en el catálogo"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>} />
              <QuickLink to="/admin/productos" label="Ver catálogo" desc="Gestionar todos los perfumes existentes"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>} />
            </div>
          </div>

          {/* Productos recientes */}
          {recentProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--espresso)' }}>Productos recientes</h2>
                <Link to="/admin/productos" style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'underline', textDecorationColor: 'var(--champagne)' }}>
                  Ver todos →
                </Link>
              </div>
              <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', boxShadow: 'var(--shadow-soft)' }}>
                {recentProducts.map((p, i) => (
                  <div key={p._id} className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: i < recentProducts.length - 1 ? '1px solid rgba(212,184,150,0.15)' : 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(247,243,238,0.5)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div style={{ width: '44px', height: '44px', overflow: 'hidden', backgroundColor: 'var(--cream-dark)', flexShrink: 0 }}>
                      <img src={p.image || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=88&h=88&fit=crop'} alt={p.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=88&h=88&fit=crop'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 400, color: 'var(--espresso)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--stone)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.brand}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--gold)' }}>{formatPrice(p.price)}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: p.stock === 0 ? '#8B4545' : p.stock <= 10 ? 'var(--gold-dark)' : '#6B8F6B' }}>{p.stock} en stock</p>
                    </div>
                    <Link to={`/admin/productos/editar/${p._id}`} style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.35rem 0.75rem', border: '1px solid rgba(184,151,90,0.3)', color: 'var(--gold)', textDecoration: 'none', flexShrink: 0, transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--gold)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--gold)'; }}>
                      Editar
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}