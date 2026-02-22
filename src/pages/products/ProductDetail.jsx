import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../api/productService';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';

const categoryStyle = {
  Mujer:  { color: '#9B7B6E', border: 'rgba(155,123,110,0.4)' },
  Hombre: { color: '#6E7B9B', border: 'rgba(110,123,155,0.4)' },
  Unisex: { color: '#8B7A6E', border: 'rgba(139,122,110,0.4)' },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data.perfume || response.data);
      } catch (err) {
        setError('No se pudo cargar el producto.');
        console.error('❌ Error al cargar producto:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '1px solid var(--champagne)', borderTopColor: 'var(--gold)',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--stone)' }}>
          Cargando fragancia...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="text-center py-28">
        <div style={{
          width: '80px', height: '80px', margin: '0 auto 2rem',
          border: '1px solid var(--champagne)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--champagne)',
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '0.75rem' }}>
          Fragancia no encontrada
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--stone)', marginBottom: '2rem' }}>
          {error}
        </p>
        <button onClick={() => navigate('/productos')} className="btn-gold">
          Volver al catálogo
        </button>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const catStyle = categoryStyle[product.category] || categoryStyle.Unisex;
  const stockLabel = product.stock > 10 ? 'En stock' : product.stock > 0 ? `Últimas ${product.stock} unidades` : 'Agotado';
  const stockColor = product.stock > 10 ? '#6B8F6B' : product.stock > 0 ? 'var(--gold-dark)' : '#8B4545';

  return (
    <div className="animate-fade-up">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-3 mb-12" style={{
        fontFamily: 'var(--font-body)', fontSize: '0.68rem',
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>
        <Link to="/productos" style={{ color: 'var(--stone)', textDecoration: 'none', transition: 'color 0.3s' }}
          onMouseEnter={e => e.target.style.color = 'var(--gold)'}
          onMouseLeave={e => e.target.style.color = 'var(--stone)'}
        >
          Colección
        </Link>
        <span style={{ color: 'var(--champagne)' }}>—</span>
        <span style={{ color: 'var(--espresso)' }}>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ── Imagen ── */}
        <div className="relative">
          {/* Marco decorativo */}
          <div style={{
            position: 'absolute', inset: '-12px',
            border: '1px solid rgba(212,184,150,0.2)',
            pointerEvents: 'none', zIndex: 0,
          }} />
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: '1', backgroundColor: 'var(--cream-dark)', zIndex: 1 }}
          >
            <img
              src={product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=700&h=700&fit=crop'}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=700&h=700&fit=crop'; }}
            />
          </div>
          {/* Ángulo decorativo dorado */}
          <div style={{
            position: 'absolute', bottom: '-12px', right: '-12px',
            width: '48px', height: '48px', zIndex: 2,
            borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)',
          }} />
          <div style={{
            position: 'absolute', top: '-12px', left: '-12px',
            width: '48px', height: '48px', zIndex: 2,
            borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)',
          }} />
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col gap-7 lg:py-4">

          {/* Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: catStyle.color,
              border: `1px solid ${catStyle.border}`, padding: '0.2rem 0.75rem',
            }}>{product.category}</span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: stockColor,
              border: `1px solid ${stockColor}`, padding: '0.2rem 0.75rem', opacity: 0.85,
            }}>{stockLabel}</span>
          </div>

          {/* Nombre */}
          <div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 400,
              color: 'var(--stone)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem',
            }}>{product.brand}</p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300, color: 'var(--espresso)', lineHeight: 1.1,
            }}>{product.name}</h1>
          </div>

          {/* Línea dorada */}
          <div className="gold-line" />

          {/* Precio */}
          <div>
            <span className="text-label" style={{ display: 'block', marginBottom: '0.25rem' }}>Precio</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '2.5rem',
              fontWeight: 300, color: 'var(--gold)', lineHeight: 1,
            }}>{formatPrice(product.price)}</span>
          </div>

          {/* Descripción */}
          {product.description && (
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 300,
              color: 'var(--stone)', lineHeight: 1.9,
            }}>{product.description}</p>
          )}

          {/* Detalles extra */}
          {(product.size || product.fragrance) && (
            <div style={{ borderTop: '1px solid rgba(212,184,150,0.25)', paddingTop: '1.5rem' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '1rem' }}>Detalles</span>
              <div className="space-y-3">
                {product.size && (
                  <div className="flex justify-between" style={{ fontFamily: 'var(--font-body)', fontSize: '0.825rem' }}>
                    <span style={{ color: 'var(--stone)', letterSpacing: '0.06em' }}>Presentación</span>
                    <span style={{ color: 'var(--espresso)', fontWeight: 400 }}>{product.size} ml</span>
                  </div>
                )}
                {product.fragrance && (
                  <div className="flex justify-between" style={{ fontFamily: 'var(--font-body)', fontSize: '0.825rem' }}>
                    <span style={{ color: 'var(--stone)', letterSpacing: '0.06em' }}>Familia olfativa</span>
                    <span style={{ color: 'var(--espresso)', fontWeight: 400 }}>{product.fragrance}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selector cantidad */}
          {inStock && (
            <div>
              <span className="text-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Cantidad</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center" style={{ border: '1px solid rgba(212,184,150,0.4)' }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    style={{
                      width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--stone)', cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                      opacity: quantity <= 1 ? 0.4 : 1, background: 'none', border: 'none',
                      fontFamily: 'var(--font-body)', fontSize: '1.1rem', transition: 'color 0.3s',
                    }}
                    onMouseEnter={e => { if (quantity > 1) e.target.style.color = 'var(--gold)'; }}
                    onMouseLeave={e => e.target.style.color = 'var(--stone)'}
                  >−</button>
                  <span style={{
                    width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--espresso)',
                    borderLeft: '1px solid rgba(212,184,150,0.4)', borderRight: '1px solid rgba(212,184,150,0.4)',
                  }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    style={{
                      width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--stone)', cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                      opacity: quantity >= product.stock ? 0.4 : 1, background: 'none', border: 'none',
                      fontFamily: 'var(--font-body)', fontSize: '1.1rem', transition: 'color 0.3s',
                    }}
                    onMouseEnter={e => { if (quantity < product.stock) e.target.style.color = 'var(--gold)'; }}
                    onMouseLeave={e => e.target.style.color = 'var(--stone)'}
                  >+</button>
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--stone-light)', letterSpacing: '0.06em' }}>
                  {product.stock} disponibles
                </span>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-gold"
              style={{ flex: 1, padding: '1rem', fontSize: '0.75rem' }}
            >
              {added ? '✓ Añadido al carrito' : !inStock ? 'Fragancia agotada' : 'Añadir al carrito'}
            </button>
            <Link
              to="/carrito"
              className="btn-outline-gold"
              style={{ flex: '0 0 auto', padding: '1rem 1.5rem', fontSize: '0.75rem' }}
            >
              Ver bolsa
            </Link>
          </div>

          {/* Volver */}
          <button
            onClick={() => navigate(-1)}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--stone)', background: 'none', border: 'none',
              cursor: 'pointer', alignSelf: 'flex-start', textDecoration: 'underline',
              textDecorationColor: 'var(--champagne)', transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--stone)'}
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}