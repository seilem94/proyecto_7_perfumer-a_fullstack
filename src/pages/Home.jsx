import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const categories = [
  {
    label: "Pour Femme",
    sub: "Feminidad en cada nota",
    filter: "Mujer",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop",
    accent: "#D4B896",
  },
  {
    label: "Pour Homme",
    sub: "Fuerza y distinción",
    filter: "Hombre",
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=800&fit=crop",
    accent: "#8B6F3E",
  },
  {
    label: "Unisex",
    sub: "Sin límites, sin género",
    filter: "Unisex",
    image:
      "https://aromatica.cr/cdn/shop/files/Decant-Aoud-Lemon-Mint-unisex-Arom_tica-CR-367596918.png?v=1743441435&width=990",
    accent: "#B8975A",
  },
];

const features = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Autenticidad Garantizada",
    desc: "Cada fragancia es 100% original, directamente de las maisons más reconocidas del mundo.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Envío a Todo Chile",
    desc: "Despacho gratuito en compras sobre $150.000 CLP. Empaque exclusivo incluido.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    title: "Asesoría Personalizada",
    desc: "Nuestros expertos en fragancias te ayudan a encontrar el aroma que te define.",
  },
];

export default function Home() {
  return (
    <div className="space-y-24 -mt-10">
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[85vh] flex items-center overflow-hidden -mx-6 lg:-mx-10"
        style={{
          background:
            "linear-gradient(135deg, var(--espresso) 0%, #4A2C20 50%, var(--gold-dark) 100%)",
        }}
      >
        {/* Patrón decorativo */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--champagne) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Círculo decorativo derecho */}
        <div
          className="absolute -right-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ border: "1px solid var(--gold)" }}
        />
        <div
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ border: "1px solid var(--champagne)" }}
        />

        {/* Imagen lateral */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&h=900&fit=crop"
            alt="Perfume de lujo"
            className="w-full h-full object-cover opacity-30"
            style={{ mixBlendMode: "luminosity" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, var(--espresso) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Contenido */}
        <div className="relative z-10 px-10 lg:px-20 py-20 max-w-3xl">
          <div className="animate-fade-up">
            <span className="text-label" style={{ color: "var(--gold-light)" }}>
              Haute Parfumerie · Santiago de Chile
            </span>
          </div>

          <h1
            className="animate-fade-up-delay-1 mt-6 mb-8"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "var(--cream)",
              letterSpacing: "-0.01em",
            }}
          >
            El arte de
            <br />
            <em style={{ color: "var(--gold-light)", fontStyle: "italic" }}>
              sentir bien.
            </em>
          </h1>

          <p
            className="animate-fade-up-delay-2 mb-10"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              fontWeight: 300,
              color: "var(--stone-light)",
              lineHeight: 1.9,
              maxWidth: "480px",
            }}
          >
            Fragancias seleccionadas de las maisons más exclusivas del mundo.
            Cada aroma, una historia. Cada historia, la tuya.
          </p>

          <div className="animate-fade-up-delay-3 flex flex-wrap gap-4">
            <Link to={ROUTES.PRODUCTS} className="btn-gold">
              Explorar Colección
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              className="btn-outline-gold"
              style={{
                borderColor: "rgba(212,184,150,0.5)",
                color: "var(--champagne)",
              }}
            >
              Ver Novedades
            </Link>
          </div>
        </div>

        {/* Indicador scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float-soft">
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "var(--stone)",
              textTransform: "uppercase",
            }}
          >
            Descubrir
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.2"
          >
            <rect x="1" y="1" width="14" height="22" rx="7" />
            <circle cx="8" cy="8" r="2" fill="var(--gold)" />
          </svg>
        </div>
      </section>

      {/* ── INTRO ───────────────────────────────────────────────────────────── */}
      <section className="text-center max-w-2xl mx-auto">
        <div className="gold-line-center mb-6" />
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 300,
            color: "var(--espresso)",
          }}
        >
          Una fragancia no es solo un aroma,
          <br />
          <em style={{ color: "var(--gold)" }}>es una memoria.</em>
        </h2>
        <p
          className="mt-4"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            fontWeight: 300,
            color: "var(--stone)",
            lineHeight: 2,
          }}
        >
          Nuestra curaduría reúne piezas olfativas de maisons francesas,
          italianas y nicho, cada una elegida por su singularidad y permanencia
          en el tiempo.
        </p>
        <div className="gold-line-center mt-6" />
      </section>

      {/* ── CATEGORÍAS ──────────────────────────────────────────────────────── */}
      <section>
        <div className="text-center mb-12">
          <span className="text-label">Nuestras Colecciones</span>
          <h2
            className="mt-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 400,
              color: "var(--espresso)",
            }}
          >
            Encuentra tu fragancia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(({ label, sub, filter, image, accent }, i) => (
            <Link
              key={filter}
              to={`${ROUTES.PRODUCTS}?category=${filter}`}
              className={`animate-fade-up-delay-${i + 1} relative overflow-hidden group block`}
              style={{
                height: "480px",
                textDecoration: "none",
              }}
            >
              {/* Imagen */}
              <img
                src={image}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to top, rgba(44,24,16,0.85) 0%, rgba(44,24,16,0.2) 60%, transparent 100%)`,
                }}
              />

              {/* Borde dorado al hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ border: `1px solid ${accent}`, pointerEvents: "none" }}
              />

              {/* Contenido */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span
                  className="block mb-1"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: accent,
                    fontWeight: 400,
                  }}
                >
                  {sub}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2.25rem",
                    fontWeight: 300,
                    color: "var(--cream)",
                    lineHeight: 1.1,
                    letterSpacing: "0.03em",
                  }}
                >
                  {label}
                </h3>
                <div
                  className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400"
                  style={{ color: accent }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    Ver colección
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section
        className="-mx-6 lg:-mx-10 px-6 lg:px-10 py-16"
        style={{
          backgroundColor: "var(--cream-dark)",
          borderTop: "1px solid rgba(212,184,150,0.25)",
          borderBottom: "1px solid rgba(212,184,150,0.25)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                className={`animate-fade-up-delay-${i + 1} flex flex-col items-center text-center gap-5`}
              >
                <div style={{ color: "var(--gold)" }}>{icon}</div>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.35rem",
                      fontWeight: 400,
                      color: "var(--espresso)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {title}
                  </h4>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.825rem",
                      fontWeight: 300,
                      color: "var(--stone)",
                      lineHeight: 1.9,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────────────── */}
      <section className="text-center py-10">
        <span className="text-label block mb-3">Empieza tu viaje olfativo</span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3.25rem)",
            fontWeight: 300,
            color: "var(--espresso)",
            marginBottom: "2rem",
          }}
        >
          ¿Listo para encontrar
          <br />
          <em style={{ color: "var(--gold)" }}>tu firma olfativa?</em>
        </h2>
        <Link to={ROUTES.PRODUCTS} className="btn-gold">
          Descubrir Fragancias
        </Link>
      </section>
    </div>
  );
}
