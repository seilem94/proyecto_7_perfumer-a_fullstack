import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';

const categoryStyle = {
  Mujer:  { color: '#9B7B6E', border: 'rgba(155,123,110,0.4)' },
  Hombre: { color: '#6E7B9B', border: 'rgba(110,123,155,0.4)' },
  Unisex: { color: '#8B7A6E', border: 'rgba(139,122,110,0.4)' },
};

export const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const catStyle = categoryStyle[product.category] || categoryStyle.Unisex;
  const inStock = product.stock > 0;

  return (
    <article
      className="group flex flex-col"
      style={{
        backgroundColor: 'var(--white)',
        border: '1px solid rgba(212,184,150,0.2)',
        boxShadow: 'var(--shadow-soft)',
        transition: 'all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
        e.currentTarget.style.borderColor = 'rgba(184,151,90,0.35)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
        e.currentTarget.style.borderColor = 'rgba(212,184,150,0.2)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Imagen */}
      <Link to={`/productos/${product._id}`} className="block relative overflow-hidden" style={{ aspectRatio: '1', flexShrink: 0 }}>
        <img
          src={product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop'; }}
        />
        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(44,24,16,0.35)' }}
        >
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--cream)',
            border: '1px solid rgba(247,243,238,0.6)', padding: '0.5rem 1.25rem',
          }}>Ver detalle</span>
        </div>
        {/* Badges */}
        {!inStock && (
          <div className="absolute top-3 left-3" style={{
            backgroundColor: 'rgba(44,24,16,0.75)', color: 'var(--stone-light)',
            fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', padding: '0.25rem 0.75rem',
          }}>Agotado</div>
        )}
        {inStock && product.stock <= 5 && (
          <div className="absolute top-3 left-3" style={{
            backgroundColor: 'var(--gold)', color: 'var(--white)',
            fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', padding: '0.25rem 0.75rem',
          }}>Últimas unidades</div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Categoría + stock */}
        <div className="flex items-center justify-between">
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: catStyle.color,
            border: `1px solid ${catStyle.border}`, padding: '0.15rem 0.6rem',
          }}>{product.category}</span>
          {inStock && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--stone-light)' }}>
              {product.stock > 5 ? `${product.stock} disponibles` : `${product.stock} restantes`}
            </span>
          )}
        </div>

        {/* Nombre y marca */}
        <div className="flex-1">
          <Link to={`/productos/${product._id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400,
              color: 'var(--espresso)', lineHeight: 1.2, marginBottom: '0.2rem',
              transition: 'color 0.3s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--espresso)'}
            >
              {product.name}
            </h3>
          </Link>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 400,
            color: 'var(--stone)', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{product.brand}</p>
        </div>

        {/* Descripción */}
        {product.description && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 300,
            color: 'var(--stone)', lineHeight: 1.7,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{product.description}</p>
        )}

        {/* Divisor */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--champagne), transparent)', opacity: 0.5 }} />

        {/* Precio + botón */}
        <div className="flex items-end justify-between gap-3">
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 400,
            color: 'var(--gold)', lineHeight: 1,
          }}>{formatPrice(product.price)}</span>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="btn-gold"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.62rem', letterSpacing: '0.12em' }}
          >
            {added ? '✓ Añadido' : inStock ? 'Añadir' : 'Agotado'}
          </button>
        </div>
      </div>
    </article>
  );
};