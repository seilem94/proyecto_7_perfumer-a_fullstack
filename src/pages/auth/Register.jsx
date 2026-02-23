import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/common/Input";
import { PasswordInput } from "../../components/common/PasswordInput";
import { ROUTES } from "../../utils/constants";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    watch,
  } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "user",
      });
      navigate("/");
    } catch (error) {
      setServerError(
        typeof error === "string" ? error : "Error al crear la cuenta",
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-10">
          <span className="text-label block mb-3">Únete a nosotros</span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.75rem",
              fontWeight: 300,
              color: "var(--espresso)",
              lineHeight: 1.1,
            }}
          >
            Crear cuenta
          </h1>
          <div className="gold-line-center mt-4" />
        </div>

        <div
          style={{
            backgroundColor: "var(--white)",
            border: "1px solid rgba(212,184,150,0.25)",
            boxShadow: "var(--shadow-medium)",
            padding: "2.5rem",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Nombre completo"
              placeholder="Juan Pérez"
              {...register("name", {
                required: "El nombre es obligatorio",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
              error={errors.name?.message}
            />
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              {...register("email", { required: "El correo es obligatorio" })}
              error={errors.email?.message}
            />
            <PasswordInput
              label="Contraseña"
              showStrength={true}
              watchValue={watch("password")}
              placeholder="Mínimo 6 caracteres"
              {...register("password", {
                required: "Requerida",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
              error={errors.password?.message}
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              {...register("passwordConfirm", {
                required: "Repite la contraseña",
                validate: (v) =>
                  v === getValues("password") || "Las contraseñas no coinciden",
              })}
              error={errors.passwordConfirm?.message}
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
              style={{
                padding: "1rem",
                fontSize: "0.75rem",
                marginTop: "0.5rem",
              }}
            >
              {isSubmitting ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>

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
            }}
          >
            ¿Ya tienes cuenta?{" "}
            <Link
              to={ROUTES.LOGIN}
              style={{
                color: "var(--gold)",
                textDecoration: "underline",
                textDecorationColor: "var(--champagne)",
              }}
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
