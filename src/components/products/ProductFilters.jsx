import { CATEGORIES } from '../../utils/constants';

const FilterTag = ({ label, onRemove }) => (
  <button
    onClick={onRemove}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.2rem 0.75rem',
      backgroundColor: 'rgba(184,151,90,0.1)',
      border: '1px solid rgba(184,151,90,0.3)',
      color: 'var(--gold-dark)',
      fontFamily: 'var(--font-body)', fontSize: '0.65rem',
      letterSpacing: '0.06em', cursor: 'pointer', transition: 'all 0.3s',
    }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(184,151,90,0.2)'}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(184,151,90,0.1)'}
  >
    {label} <span style={{ fontSize: '0.8rem' }}>×</span>
  </button>
);

const labelStyle = {
  display: 'block', marginBottom: '0.5rem',
  fontFamily: 'var(--font-body)', fontSize: '0.6rem',
  letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)',
};

export const ProductFilters = ({ filters, updateFilters, resetFilters }) => {
  const hasActive = filters.category || filters.minPrice || filters.maxPrice || filters.search;

  return (
    <div style={{
      backgroundColor: 'var(--white)',
      border: '1px solid rgba(212,184,150,0.25)',
      boxShadow: 'var(--shadow-soft)',
      padding: '2rem',
      marginBottom: '2.5rem',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="gold-line" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 400, color: 'var(--espresso)' }}>
            Refinar búsqueda
          </h2>
        </div>
        {hasActive && (
          <button onClick={resetFilters} style={{
            fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--stone)', textDecoration: 'underline',
            textDecorationColor: 'var(--champagne)', background: 'none', border: 'none', cursor: 'pointer',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--gold)'}
          onMouseLeave={e => e.target.style.color = 'var(--stone)'}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Controles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Búsqueda */}
        <div>
          <label style={labelStyle}>Buscar</label>
          <div className="relative">
            <input
              type="text" placeholder="Nombre o marca..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="input-luxury" style={{ paddingLeft: '2.25rem' }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              style={{ color: 'var(--stone-light)' }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label style={labelStyle}>Colección</label>
          <select value={filters.category} onChange={(e) => updateFilters({ category: e.target.value })}
            className="input-luxury" style={{ cursor: 'pointer' }}>
            <option value="">Todas las fragancias</option>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Precio desde */}
        <div>
          <label style={labelStyle}>Precio desde</label>
          <input type="number" min="0" placeholder="0"
            value={filters.minPrice}
            onChange={(e) => updateFilters({ minPrice: e.target.value })}
            className="input-luxury" />
        </div>

        {/* Precio hasta */}
        <div>
          <label style={labelStyle}>Precio hasta</label>
          <input type="number" min="0" placeholder="Sin límite"
            value={filters.maxPrice}
            onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            className="input-luxury" />
        </div>
      </div>

      {/* Tags activos */}
      {hasActive && (
        <div className="flex flex-wrap gap-2 mt-5 pt-5" style={{ borderTop: '1px solid rgba(212,184,150,0.2)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--stone-light)', letterSpacing: '0.1em', textTransform: 'uppercase', alignSelf: 'center' }}>
            Activos:
          </span>
          {filters.search    && <FilterTag label={`"${filters.search}"`}   onRemove={() => updateFilters({ search: '' })} />}
          {filters.category  && <FilterTag label={filters.category}        onRemove={() => updateFilters({ category: '' })} />}
          {filters.minPrice  && <FilterTag label={`Desde $${Number(filters.minPrice).toLocaleString('es-CL')}`}  onRemove={() => updateFilters({ minPrice: '' })} />}
          {filters.maxPrice  && <FilterTag label={`Hasta $${Number(filters.maxPrice).toLocaleString('es-CL')}`}  onRemove={() => updateFilters({ maxPrice: '' })} />}
        </div>
      )}
    </div>
  );
};