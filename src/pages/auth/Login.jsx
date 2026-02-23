import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/common/Input";
import { PasswordInput } from "../../components/common/PasswordInput";
import { ROUTES } from "../../utils/constants";
import { useCartStore } from "../../store/useCartStore";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const location = useLocation();
  const { migrateGuestCart } = useCartStore();
  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/";

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await login(data);
      await migrateGuestCart(); // ← migra localStorage → backend y limpia local
      navigate(redirectTo); // ← va directo al checkout (o donde iba)
    } catch (error) {
      setServerError(
        typeof error === "string" ? error : "Credenciales incorrectas",
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md animate-fade-up">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <span className="text-label block mb-3">Bienvenido de vuelta</span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.75rem",
              fontWeight: 300,
              color: "var(--espresso)",
              lineHeight: 1.1,
            }}
          >
            Iniciar sesión
          </h1>
          <div className="gold-line-center mt-4" />
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "var(--white)",
            border: "1px solid rgba(212,184,150,0.25)",
            boxShadow: "var(--shadow-medium)",
            padding: "2.5rem",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              {...register("email", { required: "El correo es obligatorio" })}
              error={errors.email?.message}
            />
            <PasswordInput
              label="Contraseña"
              {...register("password", { required: "Requerida" })}
              error={errors.password?.message}
            />

            {serverError && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  color: "#8B4545",
                  textAlign: "center",
                  padding: "0.75rem",
                  backgroundColor: "rgba(139,69,69,0.06)",
                  border: "1px solid rgba(139,69,69,0.2)",
                }}
              >
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full"
              style={{ padding: "1rem", fontSize: "0.75rem" }}
            >
              {isSubmitting ? "Verificando..." : "Acceder"}
            </button>
          </form>

          {/* Divisor */}
          <div className="divider-gold my-6">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.875rem",
                fontStyle: "italic",
                color: "var(--stone-light)",
              }}
            >
              o
            </span>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--stone)",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            ¿No tienes cuenta?{" "}
            <Link
              to={ROUTES.REGISTER}
              style={{
                color: "var(--gold)",
                textDecoration: "underline",
                textDecorationColor: "var(--champagne)",
              }}
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
