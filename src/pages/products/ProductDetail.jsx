import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../api/productService';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';

const QtyButton = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'none', border: '1px solid rgba(212,184,150,0.4)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: 'var(--stone)', fontFamily: 'var(--font-body)', fontSize: '1.1rem',
      opacity: disabled ? 0.35 : 1, transition: 'all 0.3s',
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; } }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,184,150,0.4)'; e.currentTarget.style.color = 'var(--stone)'; }}
  >
    {children}
  </button>
);

export default function ProductDetail() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const addItem     = useCartStore(state => state.addItem);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]     = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getProductById(id);
        // Backend devuelve: { success, data: { perfume: {...} } }
        const perfume = response.data?.data?.perfume
          ?? response.data?.data
          ?? response.data?.perfume
          ?? response.data;
        setProduct(perfume);
      } catch (err) {
        setError('No se pudo cargar el producto.');
        console.error('Error al cargar producto:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-5">
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--champagne)', borderTopColor: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--stone)' }}>Cargando fragancia...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !product) return (
    <div className="text-center py-28 max-w-md mx-auto">
      <div style={{ width: '72px', height: '72px', margin: '0 auto 2rem', border: '1px solid rgba(212,184,150,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--stone-light)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '0.75rem' }}>Producto no encontrado</h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--stone)', marginBottom: '2rem' }}>{error}</p>
      <button onClick={() => navigate('/productos')} className="btn-gold">Ver catálogo</button>
    </div>
  );

  // ── Helpers de estado ────────────────────────────────────────────────────
  const categoryStyles = {
    Mujer:  { color: '#9B7B6E', border: 'rgba(155,123,110,0.4)' },
    Hombre: { color: '#6E7B9B', border: 'rgba(110,123,155,0.4)' },
    Unisex: { color: '#8B7A6E', border: 'rgba(139,122,110,0.4)' },
  };
  const catStyle = categoryStyles[product.category] || categoryStyles.Unisex;

  const stockCfg = product.stock > 10
    ? { label: 'En stock',                         color: '#6B8F6B', bg: 'rgba(107,143,107,0.08)', border: 'rgba(107,143,107,0.3)' }
    : product.stock > 0
    ? { label: `Últimas ${product.stock} unidades`, color: 'var(--gold-dark)', bg: 'rgba(184,151,90,0.08)', border: 'rgba(184,151,90,0.3)' }
    : { label: 'Agotado',                           color: '#8B4545', bg: 'rgba(139,69,69,0.06)',   border: 'rgba(139,69,69,0.2)' };

  const outOfStock = product.stock === 0;

  return (
    <div className="animate-fade-up">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-10" style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone-light)' }}>
        <Link to="/productos" style={{ color: 'var(--stone-light)', textDecoration: 'none', transition: 'color 0.3s' }}
          onMouseEnter={e => e.target.style.color = 'var(--gold)'}
          onMouseLeave={e => e.target.style.color = 'var(--stone-light)'}
        >Colección</Link>
        <span style={{ color: 'var(--champagne)' }}>—</span>
        <span style={{ color: 'var(--stone)' }}>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ── Imagen ── */}
        <div style={{ position: 'relative' }}>
          {/* Marco decorativo */}
          <div style={{ position: 'absolute', top: '-12px', left: '-12px', width: '60px', height: '60px', borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', zIndex: 1 }} />
          <div style={{ position: 'absolute', bottom: '-12px', right: '-12px', width: '60px', height: '60px', borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', zIndex: 1 }} />
          <div style={{ aspectRatio: '1', overflow: 'hidden', backgroundColor: 'var(--cream-dark)' }}>
            <img
              src={product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&h=800&fit=crop'}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ transition: 'transform 0.6s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&h=800&fit=crop'; }}
            />
          </div>
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col gap-6">

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <span style={{ padding: '0.2rem 0.85rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: catStyle.color, border: `1px solid ${catStyle.border}` }}>
              {product.category}
            </span>
            <span style={{ padding: '0.2rem 0.85rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: stockCfg.color, backgroundColor: stockCfg.bg, border: `1px solid ${stockCfg.border}` }}>
              {stockCfg.label}
            </span>
          </div>

          {/* Marca + Nombre */}
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '0.5rem' }}>
              {product.brand}
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: 'var(--espresso)', lineHeight: 1.1 }}>
              {product.name}
            </h1>
          </div>

          {/* Divisor */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--champagne), transparent)' }} />

          {/* Precio */}
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>Precio</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 300, color: 'var(--espresso)' }}>
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Descripción */}
          {product.description && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--stone)', lineHeight: 1.9 }}>
              {product.description}
            </p>
          )}

          {/* Detalles adicionales */}
          {(product.size || product.fragrance) && (
            <div style={{ borderTop: '1px solid rgba(212,184,150,0.2)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {product.size && (
                <div className="flex justify-between" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--stone-light)', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.65rem' }}>Tamaño</span>
                  <span style={{ color: 'var(--charcoal)' }}>{product.size} ml</span>
                </div>
              )}
              {product.fragrance && (
                <div className="flex justify-between" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--stone-light)', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.65rem' }}>Fragancia</span>
                  <span style={{ color: 'var(--charcoal)' }}>{product.fragrance}</span>
                </div>
              )}
            </div>
          )}

          {/* Selector de cantidad */}
          {!outOfStock && (
            <div className="flex items-center gap-4">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--stone)' }}>Cantidad</span>
              <div className="flex items-center">
                <QtyButton onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</QtyButton>
                <span style={{ width: '44px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--espresso)', border: '1px solid rgba(212,184,150,0.4)', borderLeft: 'none', borderRight: 'none' }}>
                  {quantity}
                </span>
                <QtyButton onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</QtyButton>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={outOfStock ? 'btn-ghost flex-1' : 'btn-gold flex-1'}
              style={{ padding: '1rem', fontSize: '0.75rem', opacity: outOfStock ? 0.6 : 1, cursor: outOfStock ? 'not-allowed' : 'pointer' }}
            >
              {added ? '✓ Añadido a la bolsa' : outOfStock ? 'Fragancia agotada' : 'Añadir a la bolsa'}
            </button>
            <Link to="/carrito" className="btn-outline-gold" style={{ padding: '1rem 1.5rem', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
              Ver bolsa
            </Link>
          </div>

          {/* Volver */}
          <button
            onClick={() => navigate(-1)}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone-light)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'var(--champagne)', alignSelf: 'flex-start', transition: 'color 0.3s' }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--stone-light)'}
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}