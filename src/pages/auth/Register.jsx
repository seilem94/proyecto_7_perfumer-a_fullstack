import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ROUTES } from '../../utils/constants';

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'user',
      };
      await registerUser(payload);
      navigate('/');
    } catch (error) {
      alert(error || 'Error al registrarse');
    }
  };

  const password = watch('password');

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Crear cuenta</h1>
      <p className="text-gray-600 mb-6">
        Regístrate para empezar a comprar perfumes.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: { value: 6, message: 'Mínimo 6 caracteres' },
          })}
          error={errors.password?.message}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          {...register('passwordConfirm', {
            required: 'Repite la contraseña',
            validate: value =>
              value === password || 'Las contraseñas no coinciden',
          })}
          error={errors.passwordConfirm?.message}
        />

        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
        </Button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        ¿Ya tienes cuenta?{' '}
        <Link to={ROUTES.LOGIN} className="text-purple-600 hover:underline">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
};

export default Register;
