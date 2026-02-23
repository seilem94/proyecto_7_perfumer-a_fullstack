import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCartStore } from "../../store/useCartStore";
import { formatPrice } from "../../utils/formatters";
import { Input } from "../../components/common/Input";

// ── Paso indicador ────────────────────────────────────────────────────────────
const StepIndicator = ({ current, steps }) => (
  <div className="flex items-center justify-center gap-0 mb-14">
    {steps.map((label, i) => {
      const idx = i + 1;
      const done = idx < current;
      const active = idx === current;
      return (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${active || done ? "var(--gold)" : "rgba(212,184,150,0.4)"}`,
                backgroundColor: done
                  ? "var(--gold)"
                  : active
                    ? "transparent"
                    : "transparent",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: done
                  ? "var(--white)"
                  : active
                    ? "var(--gold)"
                    : "var(--stone-light)",
                transition: "all 0.4s",
              }}
            >
              {done ? "✓" : idx}
            </div>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: active ? "var(--gold)" : "var(--stone-light)",
              }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                width: "60px",
                height: "1px",
                background: `linear-gradient(90deg, ${done ? "var(--gold)" : "rgba(212,184,150,0.3)"}, ${idx < current - 1 ? "var(--gold)" : "rgba(212,184,150,0.3)"})`,
                margin: "0 12px",
                marginBottom: "22px",
              }}
            />
          )}
        </div>
      );
    })}
  </div>
);

// ── Tarjeta Stripe mock ───────────────────────────────────────────────────────
const CardInput = ({ value, onChange, placeholder, maxLength, format }) => {
  const handleChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (format === "card")
      val = val
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    if (format === "expiry") {
      if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
    }
    if (format === "cvv") val = val.slice(0, 3);
    onChange(val);
  };
  return (
    <input
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className="input-luxury"
      style={{
        fontFamily: "var(--font-body)",
        letterSpacing: format === "card" ? "0.1em" : "inherit",
      }}
    />
  );
};

// ── Confirmación ──────────────────────────────────────────────────────────────
const OrderConfirmed = ({ orderNumber, onDone }) => (
  <div className="text-center py-16 animate-fade-up max-w-lg mx-auto">
    <div
      style={{
        width: "88px",
        height: "88px",
        margin: "0 auto 2rem",
        border: "1px solid var(--gold)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--gold)",
        animation: "fadeUp 0.6s ease both",
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </div>
    <span className="text-label block mb-3">Pedido confirmado</span>
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "2.5rem",
        fontWeight: 300,
        color: "var(--espresso)",
        marginBottom: "1rem",
      }}
    >
      Gracias por su compra
    </h2>
    <div className="gold-line-center mb-6" />
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
        fontWeight: 300,
        color: "var(--stone)",
        lineHeight: 1.9,
        marginBottom: "0.5rem",
      }}
    >
      Su pedido ha sido procesado exitosamente.
    </p>
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.8rem",
        color: "var(--stone-light)",
        marginBottom: "2.5rem",
      }}
    >
      Número de orden:{" "}
      <strong
        style={{ color: "var(--gold)", fontFamily: "var(--font-display)" }}
      >
        #{orderNumber}
      </strong>
    </p>
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.78rem",
        color: "var(--stone)",
        marginBottom: "2rem",
        fontStyle: "italic",
      }}
    >
      Recibirá un correo de confirmación en breve con los detalles de su envío.
    </p>
    <button onClick={onDone} className="btn-gold">
      Volver a la tienda
    </button>
  </div>
);

// ── Checkout principal ────────────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber] = useState(() =>
    Math.floor(100000 + Math.random() * 900000),
  );

  // Tarjeta mock
  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState({});

  const shipping = totalPrice >= 150000 ? 0 : 5990;
  const finalTotal = totalPrice + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (items.length === 0 && !confirmed) {
    return (
      <div className="text-center py-24">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 400,
            color: "var(--espresso)",
            marginBottom: "1rem",
          }}
        >
          Su bolsa está vacía
        </h2>
        <Link to="/productos" className="btn-gold">
          Explorar colección
        </Link>
      </div>
    );
  }

  if (confirmed) {
    return (
      <OrderConfirmed
        orderNumber={orderNumber}
        onDone={() => {
          navigate("/");
        }}
      />
    );
  }

  // Paso 1: Envío
  const handleShipping = (data) => {
    setShippingData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Paso 2: Pago mock
  const validateCard = () => {
    const errs = {};
    if (card.number.replace(/\s/g, "").length < 16)
      errs.number = "Número de tarjeta inválido";
    if (!card.name.trim()) errs.name = "Ingrese el titular";
    if (card.expiry.length < 5) errs.expiry = "Fecha inválida";
    if (card.cvv.length < 3) errs.cvv = "CVV inválido";
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePayment = async () => {
    if (!validateCard()) return;
    setProcessing(true);
    // Simulación de procesamiento Stripe (2.5s)
    await new Promise((r) => setTimeout(r, 2500));
    clearCart();
    setProcessing(false);
    setConfirmed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sectionTitle = (text) => (
    <h3
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.4rem",
        fontWeight: 400,
        color: "var(--espresso)",
        marginBottom: "1.5rem",
      }}
    >
      {text}
    </h3>
  );

  const fieldLabel = (text) => (
    <label
      style={{
        display: "block",
        marginBottom: "0.5rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.6rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--gold)",
      }}
    >
      {text}
    </label>
  );

  return (
    <div className="animate-fade-up max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-label block mb-3">Finalizar compra</span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem,4vw,3rem)",
            fontWeight: 300,
            color: "var(--espresso)",
          }}
        >
          Checkout
        </h1>
        <div className="gold-line-center mt-3" />
      </div>

      <StepIndicator current={step} steps={["Envío", "Pago", "Confirmación"]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* ── Formulario principal ── */}
        <div className="lg:col-span-2">
          {/* PASO 1: Envío */}
          {step === 1 && (
            <form onSubmit={handleSubmit(handleShipping)}>
              <div
                style={{
                  backgroundColor: "var(--white)",
                  border: "1px solid rgba(212,184,150,0.25)",
                  boxShadow: "var(--shadow-soft)",
                  padding: "2rem",
                }}
              >
                {sectionTitle("Información de envío")}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Nombre"
                      placeholder="Juan"
                      {...register("firstName", { required: "Requerido" })}
                      error={errors.firstName?.message}
                    />
                    <Input
                      label="Apellido"
                      placeholder="Pérez"
                      {...register("lastName", { required: "Requerido" })}
                      error={errors.lastName?.message}
                    />
                  </div>
                  <Input
                    label="Correo electrónico"
                    type="email"
                    placeholder="juan@ejemplo.cl"
                    {...register("email", { required: "Requerido" })}
                    error={errors.email?.message}
                  />
                  <Input
                    label="Teléfono"
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    {...register("phone", { required: "Requerido" })}
                    error={errors.phone?.message}
                  />
                  <Input
                    label="Dirección"
                    placeholder="Av. Providencia 1234, Dpto 5B"
                    {...register("address", { required: "Requerido" })}
                    error={errors.address?.message}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Input
                      label="Ciudad"
                      placeholder="Santiago"
                      {...register("city", { required: "Requerido" })}
                      error={errors.city?.message}
                    />
                    <Input
                      label="Región"
                      placeholder="Metropolitana"
                      {...register("region", { required: "Requerido" })}
                      error={errors.region?.message}
                    />
                    <Input
                      label="Código postal"
                      placeholder="7500000"
                      {...register("zip")}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Link
                  to="/carrito"
                  className="btn-ghost"
                  style={{ padding: "1rem 1.5rem", fontSize: "0.72rem" }}
                >
                  ← Volver
                </Link>
                <button
                  type="submit"
                  className="btn-gold flex-1"
                  style={{ padding: "1rem", fontSize: "0.75rem" }}
                >
                  Continuar al pago
                </button>
              </div>
            </form>
          )}

          {/* PASO 2: Pago */}
          {step === 2 && (
            <div>
              <div
                style={{
                  backgroundColor: "var(--white)",
                  border: "1px solid rgba(212,184,150,0.25)",
                  boxShadow: "var(--shadow-soft)",
                  padding: "2rem",
                }}
              >
                {sectionTitle("Información de pago")}

                {/* Stripe badge */}
                <div
                  className="flex items-center gap-2 mb-6 pb-5"
                  style={{ borderBottom: "1px solid rgba(212,184,150,0.2)" }}
                >
                  <svg width="40" height="16" viewBox="0 0 60 25" fill="none">
                    <text
                      x="0"
                      y="18"
                      fontFamily="Arial"
                      fontWeight="700"
                      fontSize="16"
                      fill="#635BFF"
                    >
                      stripe
                    </text>
                  </svg>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.68rem",
                      color: "var(--stone-light)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Pago 100% seguro con cifrado SSL
                  </span>
                  <div className="ml-auto flex gap-2">
                    {["VISA", "MC", "AMEX"].map((b) => (
                      <span
                        key={b}
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.55rem",
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          padding: "0.2rem 0.5rem",
                          border: "1px solid rgba(212,184,150,0.4)",
                          color: "var(--stone)",
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    {fieldLabel("Número de tarjeta")}
                    <CardInput
                      value={card.number}
                      onChange={(v) => setCard((c) => ({ ...c, number: v }))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      format="card"
                    />
                    {cardErrors.number && (
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.72rem",
                          color: "#8B4545",
                          marginTop: "0.3rem",
                        }}
                      >
                        {cardErrors.number}
                      </p>
                    )}
                  </div>
                  <div>
                    {fieldLabel("Titular de la tarjeta")}
                    <input
                      value={card.name}
                      onChange={(e) =>
                        setCard((c) => ({ ...c, name: e.target.value }))
                      }
                      placeholder="JUAN PÉREZ"
                      className="input-luxury"
                      style={{
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    />
                    {cardErrors.name && (
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.72rem",
                          color: "#8B4545",
                          marginTop: "0.3rem",
                        }}
                      >
                        {cardErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      {fieldLabel("Vencimiento")}
                      <CardInput
                        value={card.expiry}
                        onChange={(v) => setCard((c) => ({ ...c, expiry: v }))}
                        placeholder="MM/AA"
                        maxLength={5}
                        format="expiry"
                      />
                      {cardErrors.expiry && (
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.72rem",
                            color: "#8B4545",
                            marginTop: "0.3rem",
                          }}
                        >
                          {cardErrors.expiry}
                        </p>
                      )}
                    </div>
                    <div>
                      {fieldLabel("CVV")}
                      <CardInput
                        value={card.cvv}
                        onChange={(v) => setCard((c) => ({ ...c, cvv: v }))}
                        placeholder="123"
                        maxLength={3}
                        format="cvv"
                      />
                      {cardErrors.cvv && (
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.72rem",
                            color: "#8B4545",
                            marginTop: "0.3rem",
                          }}
                        >
                          {cardErrors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tip: usar tarjeta de prueba */}
                <div
                  className="mt-6 p-4"
                  style={{
                    backgroundColor: "rgba(184,151,90,0.06)",
                    border: "1px solid rgba(184,151,90,0.2)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.72rem",
                      color: "var(--stone)",
                      lineHeight: 1.7,
                    }}
                  >
                    <strong style={{ color: "var(--gold-dark)" }}>
                      Modo demo:
                    </strong>{" "}
                    Use{" "}
                    <code
                      style={{
                        fontFamily: "monospace",
                        color: "var(--espresso)",
                      }}
                    >
                      4242 4242 4242 4242
                    </code>
                    , cualquier fecha futura y CVV de 3 dígitos.
                  </p>
                </div>
              </div>

              {/* Datos de envío confirmados */}
              {shippingData && (
                <div
                  className="mt-4 p-5"
                  style={{
                    backgroundColor: "var(--cream-dark)",
                    border: "1px solid rgba(212,184,150,0.2)",
                  }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-label">Enviar a</span>
                    <button
                      onClick={() => setStep(1)}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.65rem",
                        color: "var(--gold)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Editar
                    </button>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8rem",
                      color: "var(--charcoal)",
                      lineHeight: 1.8,
                    }}
                  >
                    {shippingData.firstName} {shippingData.lastName}
                    <br />
                    {shippingData.address}
                    <br />
                    {shippingData.city}, {shippingData.region}
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="btn-ghost"
                  style={{ padding: "1rem 1.5rem", fontSize: "0.72rem" }}
                >
                  ← Volver
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="btn-gold flex-1"
                  style={{ padding: "1rem", fontSize: "0.75rem" }}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3">
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "white",
                          display: "inline-block",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Procesando pago...
                    </span>
                  ) : (
                    `Pagar ${formatPrice(finalTotal)}`
                  )}
                </button>
              </div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
        </div>

        {/* ── Resumen lateral ── */}
        <div>
          <div
            style={{
              backgroundColor: "var(--white)",
              border: "1px solid rgba(212,184,150,0.25)",
              boxShadow: "var(--shadow-soft)",
              padding: "1.75rem",
              position: "sticky",
              top: "7rem",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                fontWeight: 400,
                color: "var(--espresso)",
                marginBottom: "1.25rem",
              }}
            >
              Su pedido
            </h3>

            <div
              className="space-y-4 mb-5"
              style={{
                maxHeight: "260px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              {items.map((item) => (
                <div key={item.perfume._id} className="flex gap-3 items-center">
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      flexShrink: 0,
                      backgroundColor: "var(--cream-dark)",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        item.perfume.image ||
                        "https://images.unsplash.com/photo-1541643600914-78b084683702?w=100&h=100&fit=crop"
                      }
                      alt={item.perfume.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.95rem",
                        fontWeight: 400,
                        color: "var(--espresso)",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.perfume.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.68rem",
                        color: "var(--stone-light)",
                      }}
                    >
                      x{item.quantity}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.82rem",
                      color: "var(--gold)",
                      whiteSpace: "nowrap",
                      fontWeight: 400,
                    }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, var(--champagne), transparent)",
                margin: "1rem 0",
              }}
            />

            <div className="space-y-2.5">
              {[
                [
                  `Subtotal (${totalItems} ${totalItems === 1 ? "ítem" : "ítems"})`,
                  formatPrice(totalPrice),
                ],
                ["Envío", shipping === 0 ? "Gratis" : formatPrice(shipping)],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    color: "var(--stone)",
                  }}
                >
                  <span>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
              <div
                style={{
                  height: "1px",
                  background: "rgba(212,184,150,0.25)",
                  margin: "0.5rem 0",
                }}
              />
              <div className="flex justify-between">
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.1rem",
                    fontWeight: 400,
                    color: "var(--espresso)",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                    fontWeight: 400,
                    color: "var(--gold)",
                  }}
                >
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
