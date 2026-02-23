import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/authContext';
import { authService } from '../../api/authService';
import { Input } from '../../components/common/Input';
import { formatDate } from '../../utils/formatters';

const Section = ({ title, children }) => (
  <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', boxShadow: 'var(--shadow-soft)', padding: '2rem' }}>
    <div className="flex items-center gap-4 mb-6">
      <div className="gold-line" />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--espresso)' }}>{title}</h2>
    </div>
    {children}
  </div>
);

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const onSave = async (data) => {
    setSaving(true);
    setSaveError('');
    try {
      const response = await authService.updateProfile(data);
      const updated = response.data?.data?.user ?? response.data?.data ?? data;
      updateUser(updated);
      setSaveSuccess(true);
      setEditMode(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(typeof err === 'string' ? err : 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    reset({ name: user?.name || '', email: user?.email || '' });
    setSaveError('');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const tabs = [
    { key: 'profile', label: 'Mi perfil' },
    { key: 'orders', label: 'Pedidos' },
    { key: 'security', label: 'Seguridad' },
  ];

  return (
    <div className="animate-fade-up max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-label block mb-3">Mi cuenta</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: 'var(--espresso)' }}>
          Bienvenido, {user?.name?.split(' ')[0]}
        </h1>
        <div className="gold-line-center mt-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', boxShadow: 'var(--shadow-soft)', padding: '2rem', textAlign: 'center' }}>
            {/* Avatar */}
            <div style={{ width: '80px', height: '80px', margin: '0 auto 1.25rem', borderRadius: '50%', backgroundColor: 'var(--espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--gold)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--champagne)', fontWeight: 300 }}>{initials}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '0.25rem' }}>{user?.name}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--stone-light)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{user?.email}</p>
            {user?.role === 'admin' && (
              <span style={{ display: 'inline-block', padding: '0.15rem 0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', border: '1px solid rgba(184,151,90,0.4)', marginBottom: '0.5rem' }}>Admin</span>
            )}

            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--champagne), transparent)', margin: '1.25rem 0' }} />

            {/* Nav */}
            <nav className="space-y-1">
              {tabs.map(({ key, label }) => (
                <button key={key} onClick={() => setActiveTab(key)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.08em', background: activeTab === key ? 'rgba(184,151,90,0.08)' : 'none', border: `1px solid ${activeTab === key ? 'rgba(184,151,90,0.3)' : 'transparent'}`, color: activeTab === key ? 'var(--gold)' : 'var(--stone)', cursor: 'pointer', transition: 'all 0.3s' }}>
                  {label}
                </button>
              ))}
            </nav>

            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--champagne), transparent)', margin: '1.25rem 0' }} />

            <button onClick={logout} style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8B4545', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(139,69,69,0.3)' }}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="lg:col-span-3 space-y-6">

          {/* ── Tab: Perfil ── */}
          {activeTab === 'profile' && (
            <Section title="Información personal">
              {saveSuccess && (
                <div className="mb-5 p-3" style={{ backgroundColor: 'rgba(107,143,107,0.08)', border: '1px solid rgba(107,143,107,0.3)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#4A7A4A' }}>
                  ✓ Cambios guardados correctamente
                </div>
              )}
              {saveError && (
                <div className="mb-5 p-3" style={{ backgroundColor: 'rgba(139,69,69,0.06)', border: '1px solid rgba(139,69,69,0.2)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#8B4545' }}>
                  {saveError}
                </div>
              )}

              {!editMode ? (
                <div className="space-y-5">
                  {[['Nombre completo', user?.name], ['Correo electrónico', user?.email], ['Rol', user?.role === 'admin' ? 'Administrador' : 'Cliente']].map(([label, value]) => (
                    <div key={label}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.35rem' }}>{label}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 300, color: 'var(--charcoal)', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(212,184,150,0.2)' }}>{value}</p>
                    </div>
                  ))}
                  <button onClick={() => setEditMode(true)} className="btn-outline-gold" style={{ padding: '0.75rem 2rem', fontSize: '0.7rem' }}>
                    Editar información
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSave)} className="space-y-5">
                  <Input label="Nombre completo" {...register('name', { required: 'Nombre requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })} error={errors.name?.message} />
                  <Input label="Correo electrónico" type="email" {...register('email', { required: 'Email requerido' })} error={errors.email?.message} />
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-gold" style={{ padding: '0.875rem 2rem', fontSize: '0.72rem' }}>
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button type="button" onClick={cancelEdit} className="btn-ghost" style={{ padding: '0.875rem 1.5rem', fontSize: '0.72rem' }}>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </Section>
          )}

          {/* ── Tab: Pedidos ── */}
          {activeTab === 'orders' && (
            <Section title="Historial de pedidos">
              {/* Mock orders */}
              {[
                { id: '847291', date: new Date(Date.now() - 7 * 86400000).toISOString(), items: 2, total: 270000, status: 'Entregado' },
                { id: '631047', date: new Date(Date.now() - 30 * 86400000).toISOString(), items: 1, total: 120000, status: 'Entregado' },
              ].length === 0 ? (
                <div className="text-center py-10">
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--stone)' }}>
                    Aún no tiene pedidos
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { id: '847291', date: new Date(Date.now() - 7 * 86400000).toISOString(), items: 2, total: 270000, status: 'Entregado' },
                    { id: '631047', date: new Date(Date.now() - 30 * 86400000).toISOString(), items: 1, total: 120000, status: 'Entregado' },
                  ].map(order => (
                    <div key={order.id} style={{ border: '1px solid rgba(212,184,150,0.22)', padding: '1.25rem' }}>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--stone-light)', marginBottom: '0.25rem' }}>Pedido</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--espresso)' }}>#{order.id}</p>
                        </div>
                        <div className="hidden sm:block">
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--stone-light)', marginBottom: '0.25rem' }}>Fecha</p>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--charcoal)' }}>{formatDate(order.date)}</p>
                        </div>
                        <div>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--stone-light)', marginBottom: '0.25rem' }}>Total</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)' }}>
                            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.total)}
                          </p>
                        </div>
                        <span style={{ display: 'inline-block', padding: '0.2rem 0.85rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B8F6B', border: '1px solid rgba(107,143,107,0.4)', backgroundColor: 'rgba(107,143,107,0.06)' }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* ── Tab: Seguridad ── */}
          {activeTab === 'security' && (
            <Section title="Seguridad">
              <div className="space-y-6">
                <div style={{ padding: '1.25rem', backgroundColor: 'rgba(184,151,90,0.05)', border: '1px solid rgba(184,151,90,0.18)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.4rem' }}>Cambiar contraseña</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 300, color: 'var(--stone)' }}>
                    Para cambiar su contraseña, cierre sesión e inicie el flujo de recuperación desde la pantalla de login.
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Sesión activa</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--stone)', lineHeight: 1.8 }}>
                    Conectado como <strong style={{ color: 'var(--espresso)' }}>{user?.email}</strong><br />
                    Rol: <strong style={{ color: 'var(--espresso)' }}>{user?.role === 'admin' ? 'Administrador' : 'Cliente'}</strong>
                  </p>
                </div>
                <button onClick={logout} className="btn-outline-gold" style={{ borderColor: '#8B4545', color: '#8B4545', padding: '0.75rem 2rem', fontSize: '0.7rem' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#8B4545'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8B4545'; }}
                >
                  Cerrar sesión
                </button>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}