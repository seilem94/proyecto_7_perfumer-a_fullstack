import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ROUTES } from '../../utils/constants';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/');
    } catch (error) {
      alert(error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Iniciar sesión</h1>
      <p className="text-gray-600 mb-6">
        Ingresa con tu correo y contraseña para continuar.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          {...register('password', { required: 'La contraseña es obligatoria' })}
          error={errors.password?.message}
        />

        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
        </Button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        ¿No tienes cuenta?{' '}
        <Link to={ROUTES.REGISTER} className="text-purple-600 hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};

export default Login;
