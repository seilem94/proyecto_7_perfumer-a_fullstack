import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../api/axiosConfig';

// ── Helpers ───────────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => (
  <span style={{
    padding: '0.15rem 0.75rem',
    fontFamily: 'var(--font-body)', fontSize: '0.58rem',
    letterSpacing: '0.15em', textTransform: 'uppercase',
    color: role === 'admin' ? 'var(--gold-dark)' : 'var(--stone)',
    border: `1px solid ${role === 'admin' ? 'rgba(184,151,90,0.4)' : 'rgba(212,184,150,0.3)'}`,
    backgroundColor: role === 'admin' ? 'rgba(184,151,90,0.08)' : 'transparent',
  }}>
    {role === 'admin' ? 'Admin' : 'Cliente'}
  </span>
);

// Modal de confirmación de cambio de rol
const ConfirmModal = ({ user, newRole, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: 'rgba(44,24,16,0.5)' }}
    onClick={e => e.target === e.currentTarget && onCancel()}
  >
    <div className="animate-fade-up w-full max-w-sm"
      style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.3)', boxShadow: 'var(--shadow-luxury)', padding: '2.5rem', textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', border: '1px solid rgba(184,151,90,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '0.75rem' }}>
        Cambiar rol
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--stone)', lineHeight: 1.7, marginBottom: '2rem' }}>
        ¿Desea {newRole === 'admin' ? 'promover a' : 'quitar el rol de admin a'}{' '}
        <strong style={{ color: 'var(--espresso)' }}>{user.name}</strong> como{' '}
        <strong style={{ color: 'var(--gold)' }}>{newRole === 'admin' ? 'Administrador' : 'Cliente'}</strong>?
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-ghost flex-1" style={{ padding: '0.875rem' }}>Cancelar</button>
        <button onClick={onConfirm} className="btn-gold flex-1" style={{ padding: '0.875rem' }}>Confirmar</button>
      </div>
    </div>
  </div>
);

// ── Componente principal ──────────────────────────────────────────────────────
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [confirmData, setConfirmData] = useState(null); // { user, newRole }
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Cargar usuarios — intenta el endpoint más común; ajusta si tu backend difiere
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/users/readall');
      const data = res.data?.data?.users ?? res.data?.data ?? [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      // Si el endpoint no existe aún, muestra estado vacío con mensaje claro
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Cambiar rol
  const handleRoleChange = async () => {
    if (!confirmData) return;
    const { user, newRole } = confirmData;
    setUpdatingId(user._id);
    setConfirmData(null);
    try {
      // Intenta PUT /user/update/:id con { role }
      // Si tu backend usa otra ruta, ajústala aquí
      await axiosInstance.put(`/users/update/${user._id}`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
      notify(`${user.name} ahora es ${newRole === 'admin' ? 'Administrador' : 'Cliente'}`);
    } catch (err) {
      notify(
        typeof err === 'string' ? err : 'El backend no permite cambiar roles desde este endpoint. Revisa la documentación de tu API.',
        'error'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtros
  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? u.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  const thStyle = { fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--stone)', padding: '0.875rem 1rem', textAlign: 'left', borderBottom: '1px solid rgba(212,184,150,0.25)', whiteSpace: 'nowrap' };
  const tdStyle = { fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--charcoal)', padding: '1rem', borderBottom: '1px solid rgba(212,184,150,0.15)', verticalAlign: 'middle' };

  const initials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="animate-fade-up">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-fade-up" style={{ padding: '0.875rem 1.5rem', backgroundColor: toast.type === 'error' ? '#8B4545' : 'var(--espresso)', color: 'var(--champagne)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', boxShadow: 'var(--shadow-luxury)', minWidth: '280px' }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <span className="text-label block mb-2">Gestión de accesos</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 300, color: 'var(--espresso)' }}>
          Usuarios
        </h1>
        <div className="gold-line mt-3" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total usuarios', value: users.length },
          { label: 'Administradores', value: users.filter(u => u.role === 'admin').length },
          { label: 'Clientes', value: users.filter(u => u.role !== 'admin').length },
        ].map(({ label, value }) => (
          <div key={label} style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>{value}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone)', marginTop: '0.4rem' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1" style={{ maxWidth: '360px' }}>
          <input type="text" placeholder="Buscar por nombre o email..." value={search} onChange={e => setSearch(e.target.value)} className="input-luxury" style={{ paddingLeft: '2.25rem' }} />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--stone-light)' }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-luxury" style={{ width: 'auto', minWidth: '160px', cursor: 'pointer' }}>
          <option value="">Todos los roles</option>
          <option value="admin">Administradores</option>
          <option value="user">Clientes</option>
        </select>
      </div>

      {/* Aviso si el endpoint no existe */}
      {/* <div className="mb-6 p-4" style={{ backgroundColor: 'rgba(184,151,90,0.06)', border: '1px solid rgba(184,151,90,0.2)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--stone)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--gold-dark)' }}>Nota:</strong> Esta vista requiere que el backend exponga{' '}
          <code style={{ fontFamily: 'monospace', color: 'var(--espresso)', fontSize: '0.8rem' }}>GET /api/user/readall</code> y{' '}
          <code style={{ fontFamily: 'monospace', color: 'var(--espresso)', fontSize: '0.8rem' }}>PUT /api/user/update/:id</code>{' '}
          con soporte para el campo <code style={{ fontFamily: 'monospace', color: 'var(--espresso)', fontSize: '0.8rem' }}>role</code>.
          Si el endpoint no existe, los usuarios no cargarán y el cambio de rol devolverá error.
        </p>
      </div> */}

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--champagne)', borderTopColor: 'var(--gold)', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16" style={{ border: '1px solid rgba(212,184,150,0.2)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--stone)' }}>
            {users.length === 0
              ? 'El endpoint de usuarios no está disponible en el backend'
              : 'No se encontraron usuarios'}
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.22)', boxShadow: 'var(--shadow-soft)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--cream)' }}>
                <tr>
                  <th style={thStyle}>Usuario</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Rol actual</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user._id}
                    style={{ transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(247,243,238,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Usuario */}
                    <td style={tdStyle}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(184,151,90,0.3)' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--champagne)' }}>{initials(user.name)}</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 400, color: 'var(--espresso)' }}>{user.name}</span>
                      </div>
                    </td>
                    {/* Email */}
                    <td style={{ ...tdStyle, color: 'var(--stone)', fontSize: '0.78rem' }}>{user.email}</td>
                    {/* Rol */}
                    <td style={tdStyle}><RoleBadge role={user.role} /></td>
                    {/* Acción */}
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      {updatingId === user._id ? (
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--stone-light)', fontStyle: 'italic' }}>Actualizando...</span>
                      ) : (
                        <button
                          onClick={() => setConfirmData({ user, newRole: user.role === 'admin' ? 'user' : 'admin' })}
                          style={{
                            fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                            padding: '0.4rem 0.875rem', cursor: 'pointer', transition: 'all 0.3s',
                            border: user.role === 'admin' ? '1px solid rgba(139,69,69,0.3)' : '1px solid rgba(184,151,90,0.4)',
                            color: user.role === 'admin' ? '#8B4545' : 'var(--gold)',
                            backgroundColor: 'transparent',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = user.role === 'admin' ? '#8B4545' : 'var(--gold)';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = user.role === 'admin' ? '#8B4545' : 'var(--gold)';
                          }}
                        >
                          {user.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid rgba(212,184,150,0.15)', fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--stone-light)' }}>
            {filtered.length} de {users.length} usuarios
          </div>
        </div>
      )}

      {confirmData && (
        <ConfirmModal
          user={confirmData.user}
          newRole={confirmData.newRole}
          onConfirm={handleRoleChange}
          onCancel={() => setConfirmData(null)}
        />
      )}
    </div>
  );
}
