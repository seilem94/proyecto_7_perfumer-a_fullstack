import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../api/productService';
import { formatPrice } from '../../utils/formatters';

const StatusBadge = ({ stock }) => {
  const cfg = stock > 10 ? { label: 'En stock', color: '#6B8F6B', bg: 'rgba(107,143,107,0.08)', border: 'rgba(107,143,107,0.3)' }
    : stock > 0 ? { label: `${stock} restantes`, color: 'var(--gold-dark)', bg: 'rgba(184,151,90,0.08)', border: 'rgba(184,151,90,0.3)' }
      : { label: 'Agotado', color: '#8B4545', bg: 'rgba(139,69,69,0.06)', border: 'rgba(139,69,69,0.2)' };
  return (
    <span style={{ padding: '0.15rem 0.65rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  );
};

// Modal de confirmación de borrado
const DeleteModal = ({ product, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(44,24,16,0.5)' }} onClick={e => e.target === e.currentTarget && onCancel()}>
    <div className="animate-fade-up w-full max-w-sm" style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.3)', boxShadow: 'var(--shadow-luxury)', padding: '2.5rem', textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', border: '1px solid rgba(139,69,69,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B4545' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '0.75rem' }}>Eliminar producto</h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--stone)', lineHeight: 1.7, marginBottom: '2rem' }}>
        ¿Está seguro de que desea eliminar <strong style={{ color: 'var(--espresso)' }}>{product.name}</strong>? Esta acción no se puede deshacer.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-ghost flex-1" style={{ padding: '0.875rem' }}>Cancelar</button>
        <button onClick={onConfirm} style={{ flex: 1, padding: '0.875rem', backgroundColor: '#8B4545', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }} onMouseEnter={e => e.target.style.backgroundColor = '#723838'} onMouseLeave={e => e.target.style.backgroundColor = '#8B4545'}>
          Sí, eliminar
        </button>
      </div>
    </div>
  </div>
);

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getAllProducts();
      // Backend: { success, data: { perfumes: [...] } }
      const data = res.data?.data;
      const perfumes = data?.perfumes ?? data ?? [];
      setProducts(Array.isArray(perfumes) ? perfumes : []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async () => {
    try {
      await productService.deleteProduct(deleteTarget._id);
      notify(`"${deleteTarget.name}" eliminado`);
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      notify('Error al eliminar el producto', 'error');
      setDeleteTarget(null);
    }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const thStyle = { fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--stone)', padding: '0.875rem 1rem', textAlign: 'left', borderBottom: '1px solid rgba(212,184,150,0.25)', whiteSpace: 'nowrap' };
  const tdStyle = { fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--charcoal)', padding: '1rem', borderBottom: '1px solid rgba(212,184,150,0.15)', verticalAlign: 'middle' };

  return (
    <div className="animate-fade-up">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-fade-up" style={{ padding: '0.875rem 1.5rem', backgroundColor: toast.type === 'error' ? '#8B4545' : 'var(--espresso)', color: 'var(--champagne)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', boxShadow: 'var(--shadow-luxury)', minWidth: '260px' }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
        <div>
          <span className="text-label block mb-2">Gestión de inventario</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 300, color: 'var(--espresso)' }}>
            Catálogo de Perfumes
          </h1>
        </div>
        <Link to="/admin/productos/crear" className="btn-gold" style={{ whiteSpace: 'nowrap', padding: '0.875rem 1.75rem', fontSize: '0.72rem' }}>
          + Nuevo perfume
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total productos', value: products.length },
          { label: 'En stock', value: products.filter(p => p.stock > 10).length },
          { label: 'Stock bajo', value: products.filter(p => p.stock > 0 && p.stock <= 10).length },
          { label: 'Agotados', value: products.filter(p => p.stock === 0).length },
        ].map(({ label, value }) => (
          <div key={label} style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>{value}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone)', marginTop: '0.4rem' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Buscador */}
      <div className="relative mb-6" style={{ maxWidth: '360px' }}>
        <input type="text" placeholder="Buscar por nombre o marca..." value={search} onChange={e => setSearch(e.target.value)} className="input-luxury" style={{ paddingLeft: '2.25rem' }} />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--stone-light)' }}>
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--champagne)', borderTopColor: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16" style={{ border: '1px solid rgba(212,184,150,0.2)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--stone)' }}>No se encontraron productos</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', boxShadow: 'var(--shadow-soft)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--cream)' }}>
                <tr>
                  <th style={thStyle}>Producto</th>
                  <th style={thStyle}>Categoría</th>
                  <th style={thStyle}>Precio</th>
                  <th style={thStyle}>Stock</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product._id} style={{ transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(247,243,238,0.6)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    {/* Producto */}
                    <td style={tdStyle}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '48px', height: '48px', flexShrink: 0, overflow: 'hidden', backgroundColor: 'var(--cream-dark)' }}>
                          <img src={product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=100&h=100&fit=crop'} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=100&h=100&fit=crop'; }} />
                        </div>
                        <div>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 400, color: 'var(--espresso)', lineHeight: 1.2 }}>{product.name}</p>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--stone)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    {/* Categoría */}
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: product.category === 'Mujer' ? '#9B7B6E' : product.category === 'Hombre' ? '#6E7B9B' : '#8B7A6E', border: `1px solid ${product.category === 'Mujer' ? 'rgba(155,123,110,0.4)' : product.category === 'Hombre' ? 'rgba(110,123,155,0.4)' : 'rgba(139,122,110,0.4)'}`, padding: '0.15rem 0.65rem' }}>
                        {product.category}
                      </span>
                    </td>
                    {/* Precio */}
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--gold)' }}>{formatPrice(product.price)}</span>
                    </td>
                    {/* Stock */}
                    <td style={tdStyle}><StatusBadge stock={product.stock} /></td>
                    {/* Acciones */}
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/productos/editar/${product._id}`} style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.4rem 0.875rem', border: '1px solid rgba(184,151,90,0.4)', color: 'var(--gold)', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--gold)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--gold)'; }}>
                          Editar
                        </Link>
                        <button onClick={() => setDeleteTarget(product)} style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.4rem 0.875rem', border: '1px solid rgba(139,69,69,0.3)', color: '#8B4545', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#8B4545'; e.currentTarget.style.color = 'white'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8B4545'; }}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid rgba(212,184,150,0.15)', fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--stone-light)' }}>
            {filtered.length} de {products.length} productos
          </div>
        </div>
      )}

      {deleteTarget && <DeleteModal product={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}