import { Link } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { formatPrice } from "../../utils/formatters";
import { useAuth } from "../../context/authContext";

const QtyButton = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: "1px solid rgba(212,184,150,0.4)",
      cursor: disabled ? "not-allowed" : "pointer",
      color: "var(--stone)",
      fontFamily: "var(--font-body)",
      fontSize: "1rem",
      opacity: disabled ? 0.35 : 1,
      transition: "all 0.3s",
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.borderColor = "var(--gold)";
        e.currentTarget.style.color = "var(--gold)";
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(212,184,150,0.4)";
      e.currentTarget.style.color = "var(--stone)";
    }}
  >
    {children}
  </button>
);

export default function Cart() {
  const {
    items,
    totalItems,
    totalPrice,
    loading,
    updateItemQuantity,
    removeItem,
    clearCart,
  } = useCartStore();
  const shipping = totalPrice >= 150000 ? 0 : 5990;
  const finalTotal = totalPrice + shipping;

  const { isAuthenticated } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center py-40">
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid var(--champagne)",
            borderTopColor: "var(--gold)",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-12">
        <span className="text-label block mb-3">Su selección</span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem,4vw,3.25rem)",
            fontWeight: 300,
            color: "var(--espresso)",
          }}
        >
          Mi Bolsa
        </h1>
        <div className="gold-line-center mt-3 mb-3" />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.825rem",
            color: "var(--stone)",
          }}
        >
          {totalItems} {totalItems === 1 ? "fragancia" : "fragancias"}
        </p>
      </div>

      {items.length === 0 ? (
        <div
          className="text-center py-24 mx-auto"
          style={{
            backgroundColor: "var(--white)",
            border: "1px solid rgba(212,184,150,0.2)",
            boxShadow: "var(--shadow-soft)",
            maxWidth: "480px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 2rem",
              border: "1px solid var(--champagne)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--champagne)",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 400,
              color: "var(--espresso)",
              marginBottom: "0.75rem",
            }}
          >
            Su bolsa está vacía
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--stone)",
              marginBottom: "2rem",
            }}
          >
            Explore nuestra colección y encuentre su fragancia perfecta
          </p>
          <Link to="/productos" className="btn-gold">
            Explorar colección
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.perfume._id}
                style={{
                  backgroundColor: "var(--white)",
                  border: "1px solid rgba(212,184,150,0.2)",
                  padding: "1.5rem",
                }}
              >
                <div className="flex gap-5">
                  <Link
                    to={`/productos/${item.perfume._id}`}
                    style={{ flexShrink: 0 }}
                  >
                    <div
                      style={{
                        width: "88px",
                        height: "88px",
                        overflow: "hidden",
                        backgroundColor: "var(--cream-dark)",
                      }}
                    >
                      <img
                        src={
                          item.perfume.image ||
                          "https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&h=200&fit=crop"
                        }
                        alt={item.perfume.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&h=200&fit=crop";
                        }}
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3 mb-1">
                      <div>
                        <Link
                          to={`/productos/${item.perfume._id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <h3
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "1.1rem",
                              fontWeight: 400,
                              color: "var(--espresso)",
                              lineHeight: 1.2,
                            }}
                          >
                            {item.perfume.name}
                          </h3>
                        </Link>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.68rem",
                            color: "var(--stone)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginTop: "0.2rem",
                          }}
                        >
                          {item.perfume.brand}
                        </p>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.2rem",
                          fontWeight: 400,
                          color: "var(--gold)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.7rem",
                        color: "var(--stone-light)",
                        marginBottom: "1rem",
                      }}
                    >
                      {formatPrice(item.price)} c/u
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <QtyButton
                          onClick={() =>
                            updateItemQuantity(
                              item.perfume._id,
                              item.quantity - 1,
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </QtyButton>
                        <span
                          style={{
                            width: "40px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-display)",
                            fontSize: "1.05rem",
                            color: "var(--espresso)",
                            border: "1px solid rgba(212,184,150,0.4)",
                            borderLeft: "none",
                            borderRight: "none",
                          }}
                        >
                          {item.quantity}
                        </span>
                        <QtyButton
                          onClick={() =>
                            updateItemQuantity(
                              item.perfume._id,
                              item.quantity + 1,
                            )
                          }
                          disabled={false}
                        >
                          +
                        </QtyButton>
                      </div>
                      <button
                        onClick={() => removeItem(item.perfume._id)}
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.63rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--stone-light)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline",
                          textDecorationColor: "var(--champagne)",
                          transition: "color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#8B4545")}
                        onMouseLeave={(e) =>
                          (e.target.style.color = "var(--stone-light)")
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.63rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--stone)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textDecorationColor: "var(--champagne)",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#8B4545")}
                onMouseLeave={(e) => (e.target.style.color = "var(--stone)")}
              >
                Vaciar bolsa
              </button>
            </div>
          </div>

          {/* Resumen */}
          <div>
            <div
              style={{
                backgroundColor: "var(--white)",
                border: "1px solid rgba(212,184,150,0.25)",
                boxShadow: "var(--shadow-soft)",
                padding: "2rem",
                position: "sticky",
                top: "7rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: "var(--espresso)",
                  marginBottom: "1.5rem",
                }}
              >
                Resumen
              </h3>
              <div className="space-y-3 mb-6">
                <div
                  className="flex justify-between"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    color: "var(--stone)",
                  }}
                >
                  <span>
                    Subtotal ({totalItems} {totalItems === 1 ? "ítem" : "ítems"}
                    )
                  </span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div
                  className="flex justify-between"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    color: "var(--stone)",
                  }}
                >
                  <span>Envío</span>
                  <span
                    style={{ color: shipping === 0 ? "#6B8F6B" : "inherit" }}
                  >
                    {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.7rem",
                      color: "var(--gold)",
                      fontStyle: "italic",
                    }}
                  >
                    Agrega {formatPrice(150000 - totalPrice)} más para envío
                    gratis
                  </p>
                )}
                <div
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(90deg, var(--champagne), transparent)",
                    margin: "0.75rem 0",
                  }}
                />
                <div className="flex justify-between">
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.2rem",
                      fontWeight: 400,
                      color: "var(--espresso)",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.35rem",
                      fontWeight: 400,
                      color: "var(--gold)",
                    }}
                  >
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
              <Link
                to={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"}
                className="btn-gold w-full block text-center"
                style={{ padding: "1rem", fontSize: "0.75rem" }}
                >
                Proceder al pago
              </Link>
              <Link
                to="/productos"
                className="btn-ghost w-full block text-center mt-3"
                style={{ padding: "0.875rem", fontSize: "0.72rem" }}
                >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
