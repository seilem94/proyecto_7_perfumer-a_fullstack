import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { productService } from '../../api/productService';
import { Input } from '../../components/common/Input';
import { CATEGORIES } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';

const fieldLabel = (text, required = false) => (
  <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
    {text}{required && <span style={{ color: '#8B4545', marginLeft: '0.2rem' }}>*</span>}
  </label>
);

export default function AdminCreateProduct() {
  const { id } = useParams(); // si hay id → modo edición
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [serverError, setServerError] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: { name: '', brand: '', description: '', price: '', stock: '', category: '', image: '' },
  });

  const imageUrl = watch('image');
  useEffect(() => {
    const timer = setTimeout(() => setPreviewImage(imageUrl), 600);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  // Cargar producto si es edición
  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        const res = await productService.getProductById(id);
        const p = res.data?.perfume || res.data;
        reset({ name: p.name || '', brand: p.brand || '', description: p.description || '', price: p.price || '', stock: p.stock || '', category: p.category || '', image: p.image || '' });
        setPreviewImage(p.image || '');
      } catch {
        setServerError('No se pudo cargar el producto');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    const payload = { ...data, price: Number(data.price), stock: Number(data.stock) };
    try {
      if (isEdit) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }
      navigate('/admin/productos');
    } catch (err) {
      setServerError(typeof err === 'string' ? err : 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return (
    <div className="flex justify-center py-32">
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--champagne)', borderTopColor: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="animate-fade-up max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <button onClick={() => navigate('/admin/productos')} style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--stone)'}>
          ← Volver al catálogo
        </button>
        <span className="text-label block mb-2">{isEdit ? 'Editar producto' : 'Nuevo producto'}</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 300, color: 'var(--espresso)' }}>
          {isEdit ? 'Editar perfume' : 'Agregar perfume'}
        </h1>
        <div className="gold-line mt-3" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Formulario principal ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Información básica */}
            <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', boxShadow: 'var(--shadow-soft)', padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '1.5rem' }}>Información básica</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input label="Nombre *" placeholder="Chanel No. 5" {...register('name', { required: 'El nombre es obligatorio' })} error={errors.name?.message} />
                  <Input label="Marca *" placeholder="Chanel" {...register('brand', { required: 'La marca es obligatoria' })} error={errors.brand?.message} />
                </div>

                <div>
                  {fieldLabel('Categoría', true)}
                  <select {...register('category', { required: 'Seleccione una categoría' })} className="input-luxury" style={{ cursor: 'pointer', borderColor: errors.category ? '#8B4545' : undefined }}>
                    <option value="">Seleccionar categoría...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#8B4545', marginTop: '0.3rem' }}>{errors.category.message}</p>}
                </div>

                <div>
                  {fieldLabel('Descripción')}
                  <textarea
                    {...register('description')}
                    placeholder="Descripción de la fragancia, notas olfativas, ocasión recomendada..."
                    rows={4}
                    style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.4)', color: 'var(--charcoal)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 300, outline: 'none', resize: 'vertical', transition: 'all 0.3s', borderRadius: 0 }}
                    onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 2px rgba(184,151,90,0.14)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(212,184,150,0.4)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            </div>

            {/* Precio y stock */}
            <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', boxShadow: 'var(--shadow-soft)', padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '1.5rem' }}>Precio e inventario</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Input label="Precio (CLP) *" type="number" min="0" placeholder="50000" {...register('price', { required: 'El precio es obligatorio', min: { value: 1, message: 'El precio debe ser mayor a 0' } })} error={errors.price?.message} />
                  {watch('price') && !errors.price && (
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--gold)', marginTop: '0.4rem' }}>
                      {formatPrice(Number(watch('price')))}
                    </p>
                  )}
                </div>
                <Input label="Stock *" type="number" min="0" placeholder="10" {...register('stock', { required: 'El stock es obligatorio', min: { value: 0, message: 'El stock no puede ser negativo' } })} error={errors.stock?.message} />
              </div>
            </div>

            {/* Error servidor */}
            {serverError && (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(139,69,69,0.06)', border: '1px solid rgba(139,69,69,0.2)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#8B4545' }}>
                {serverError}
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-4">
              <button type="button" onClick={() => navigate('/admin/productos')} className="btn-ghost" style={{ padding: '1rem 1.75rem', fontSize: '0.72rem' }}>
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="btn-gold flex-1" style={{ padding: '1rem', fontSize: '0.75rem' }}>
                {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear perfume'}
              </button>
            </div>
          </div>

          {/* ── Panel lateral: imagen ── */}
          <div>
            <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', boxShadow: 'var(--shadow-soft)', padding: '2rem', position: 'sticky', top: '7rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '1.25rem' }}>Imagen del producto</h3>

              {/* Preview */}
              <div style={{ aspectRatio: '1', backgroundColor: 'var(--cream-dark)', marginBottom: '1.25rem', overflow: 'hidden', border: '1px solid rgba(212,184,150,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" onError={() => setPreviewImage('')} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--stone-light)' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 0.75rem' }}>
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.08em' }}>Vista previa</p>
                  </div>
                )}
              </div>

              <Input label="URL de imagen" type="url" placeholder="https://example.com/imagen.jpg" {...register('image')} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--stone-light)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Ingrese la URL de la imagen del perfume. Se actualizará la vista previa automáticamente.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}