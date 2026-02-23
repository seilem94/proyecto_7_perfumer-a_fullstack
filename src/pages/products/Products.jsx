import { useProducts } from '../../hooks/useProducts';
import { ProductFilters } from '../../components/products/ProductFilters';
import { ProductCard } from '../../components/products/ProductCard';

export default function Products() {
  const { products, loading, filters, updateFilters, resetFilters } = useProducts();

  const hasFilters = filters.category || filters.minPrice || filters.maxPrice || filters.search;

  return (
    <div>
      {/* ── Header editorial ── */}
      <div className="text-center mb-14 animate-fade-up">
        <span className="text-label block mb-3">Colección Completa</span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 300,
          color: 'var(--espresso)',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
        }}>
          Catálogo de Fragancias
        </h1>
        <div className="gold-line-center mt-4 mb-4" />
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 300,
          color: 'var(--stone)', lineHeight: 1.9, maxWidth: '500px', margin: '0 auto',
        }}>
          {loading
            ? 'Cargando nuestra selección...'
            : `${products.length} ${products.length === 1 ? 'fragancia exclusiva' : 'fragancias exclusivas'} disponibles`}
        </p>
      </div>

      {/* ── Filtros ── */}
      <ProductFilters filters={filters} updateFilters={updateFilters} resetFilters={resetFilters} />

      {/* ── Loading ── */}
      {loading && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 gap-5">
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: '1px solid var(--champagne)', borderTopColor: 'var(--gold)',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--stone)' }}>
            Preparando su selección...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

      /* ── Sin resultados ── */
      ) : products.length === 0 ? (
        <div className="text-center py-24" style={{
          backgroundColor: 'var(--white)',
          border: '1px solid rgba(212,184,150,0.2)',
          boxShadow: 'var(--shadow-soft)',
        }}>
          <div style={{
            width: '72px', height: '72px', margin: '0 auto 1.5rem',
            border: '1px solid var(--champagne)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--champagne)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '0.75rem' }}>
            Sin resultados
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 300, color: 'var(--stone)', marginBottom: '2rem' }}>
            No encontramos fragancias con esos criterios. Prueba ajustar los filtros.
          </p>
          <button onClick={resetFilters} className="btn-outline-gold">
            Ver todas las fragancias
          </button>
        </div>

      /* ── Grid de productos ── */
      ) : (
        <>
          {/* Contador + orden */}
          <div className="flex items-center justify-between mb-6" style={{ borderBottom: '1px solid rgba(212,184,150,0.2)', paddingBottom: '1rem' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--stone)', letterSpacing: '0.06em' }}>
              {hasFilters ? (
                <span>
                  Mostrando <strong style={{ color: 'var(--espresso)' }}>{products.length}</strong> resultados
                </span>
              ) : (
                <span>
                  <strong style={{ color: 'var(--espresso)' }}>{products.length}</strong> fragancias disponibles
                </span>
              )}
            </p>
            {hasFilters && (
              <button
                onClick={resetFilters}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--gold)', background: 'none', border: 'none',
                  cursor: 'pointer',
                }}
              >
                Ver todas →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <div
                key={product._id}
                className={`animate-fade-up-delay-${Math.min(i + 1, 5)}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}