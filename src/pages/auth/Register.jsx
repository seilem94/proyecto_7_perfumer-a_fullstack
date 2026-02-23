import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { PasswordInput } from '../../components/common/PasswordInput';
import { ROUTES } from '../../utils/constants';

const ROLES = [
  { value: 'user',  label: 'Cliente',       desc: 'Acceso al catálogo y compras' },
  { value: 'admin', label: 'Administrador', desc: 'Acceso completo al panel de gestión' },
];

const Register = () => {
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, getValues } = useForm({
    defaultValues: { role: 'user' },
  });
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const selectedRole  = useWatch({ control, name: 'role' });
  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerUser({
        name:     data.name,
        email:    data.email,
        password: data.password,
        role:     data.role,
      });
      navigate('/');
    } catch (error) {
      setServerError(typeof error === 'string' ? error : 'Error al crear la cuenta');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md animate-fade-up">

        <div className="text-center mb-10">
          <span className="text-label block mb-3">Únete a nosotros</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.75rem', fontWeight: 300, color: 'var(--espresso)', lineHeight: 1.1 }}>
            Crear cuenta
          </h1>
          <div className="gold-line-center mt-4" />
        </div>

        <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.25)', boxShadow: 'var(--shadow-medium)', padding: '2.5rem' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <Input
              label="Nombre completo"
              placeholder="Juan Pérez"
              {...register('name', {
                required: 'El nombre es obligatorio',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={errors.name?.message}
            />

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              {...register('email', { required: 'El correo es obligatorio' })}
              error={errors.email?.message}
            />

            <PasswordInput
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              showStrength={true}
              watchValue={passwordValue}
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
              error={errors.password?.message}
            />

            <PasswordInput
              label="Confirmar contraseña"
              placeholder="••••••••"
              {...register('passwordConfirm', {
                required: 'Repite la contraseña',
                validate: v => v === getValues('password') || 'Las contraseñas no coinciden',
              })}
              error={errors.passwordConfirm?.message}
            />

            {/* ── Selector de rol ── */}
            <div className="flex flex-col gap-1.5">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Tipo de cuenta
              </span>

              <div className="flex gap-3">
                {ROLES.map(({ value, label, desc }) => {
                  const isSelected = selectedRole === value;
                  return (
                    <label
                      key={value}
                      style={{
                        flex: 1, cursor: 'pointer', padding: '0.875rem',
                        border: `1px solid ${isSelected ? 'var(--gold)' : 'rgba(212,184,150,0.3)'}`,
                        backgroundColor: isSelected ? 'rgba(184,151,90,0.06)' : 'transparent',
                        transition: 'all 0.3s',
                      }}
                    >
                      <input type="radio" value={value} {...register('role')} style={{ display: 'none' }} />
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500, color: isSelected ? 'var(--gold-dark)' : 'var(--charcoal)', marginBottom: '0.2rem' }}>
                        {label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--stone-light)', lineHeight: 1.5 }}>
                        {desc}
                      </p>
                    </label>
                  );
                })}
              </div>

              <div style={{ marginTop: '0.4rem', padding: '0.6rem 0.875rem', backgroundColor: 'rgba(184,151,90,0.05)', border: '1px solid rgba(184,151,90,0.18)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--stone)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--gold-dark)' }}>Entorno de prueba:</strong> La selección de rol está habilitada para facilitar el testing del proyecto evaluativo. En producción esta opción no estaría disponible.
                </p>
              </div>
            </div>

            {serverError && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#8B4545', textAlign: 'center', padding: '0.75rem', backgroundColor: 'rgba(139,69,69,0.06)', border: '1px solid rgba(139,69,69,0.2)' }}>
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full"
              style={{ padding: '1rem', fontSize: '0.75rem', marginTop: '0.5rem' }}
            >
              {isSubmitting
                ? 'Creando cuenta...'
                : `Registrarse como ${selectedRole === 'admin' ? 'Administrador' : 'Cliente'}`}
            </button>
          </form>

          <div className="divider-gold my-6">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--stone-light)' }}>o</span>
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--stone)', textAlign: 'center' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to={ROUTES.LOGIN} style={{ color: 'var(--gold)', textDecoration: 'underline', textDecorationColor: 'var(--champagne)' }}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;