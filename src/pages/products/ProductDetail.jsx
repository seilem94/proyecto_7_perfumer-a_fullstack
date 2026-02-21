import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "../../api/productService";
import { useCartStore } from "../../store/useCartStore";
import { formatPrice } from "../../utils/formatters";
import { Button } from "../../components/common/Button";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getProductById(id);
        // El backend puede devolver { perfume } o directamente el objeto
        setProduct(response.data.perfume || response.data);
      } catch (err) {
        setError("No se pudo cargar el producto.");
        console.error("❌ Error al cargar producto:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <span className="text-6xl mb-6 block">🚫</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Producto no encontrado
        </h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <Button onClick={() => navigate("/productos")} variant="primary">
          Volver a productos
        </Button>
      </div>
    );
  }

  // ── Vista ────────────────────────────────────────────────────────────────
  const categoryColor =
    product.category === "Hombre"
      ? "bg-blue-100 text-blue-800"
      : product.category === "Mujer"
      ? "bg-pink-100 text-pink-800"
      : "bg-indigo-100 text-indigo-800";

  const stockStatus =
    product.stock > 10
      ? { label: "En stock", cls: "bg-emerald-100 text-emerald-800" }
      : product.stock > 0
      ? { label: `Últimas ${product.stock} unidades`, cls: "bg-amber-100 text-amber-800" }
      : { label: "Sin stock", cls: "bg-red-100 text-red-800" };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/productos" className="hover:text-purple-600 transition-colors">
          Productos
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen */}
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
          <img
            src={
              product.image ||
              `https://via.placeholder.com/600x600/${
                product.category === "Hombre" ? "4169E1" : "FF69B4"
              }/FFFFFF?text=${encodeURIComponent(product.name)}`
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${categoryColor}`}>
              {product.category}
            </span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${stockStatus.cls}`}>
              {stockStatus.label}
            </span>
          </div>

          {/* Nombre y marca */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{product.name}</h1>
            <p className="text-lg font-semibold text-gray-500">{product.brand}</p>
          </div>

          {/* Precio */}
          <div className="text-4xl font-bold text-purple-600">
            {formatPrice(product.price)}
          </div>

          {/* Descripción */}
          {product.description && (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {/* Detalles adicionales */}
          {(product.size || product.fragrance) && (
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
              {product.size && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Tamaño</span>
                  <span>{product.size} ml</span>
                </div>
              )}
              {product.fragrance && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Fragancia</span>
                  <span>{product.fragrance}</span>
                </div>
              )}
            </div>
          )}

          {/* Selector de cantidad */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">Cantidad</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 font-bold"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 font-bold"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-4 pt-2">
            <Button
              onClick={handleAddToCart}
              variant="primary"
              className="flex-1 py-4 text-lg"
              disabled={product.stock === 0}
            >
              {added ? "✅ Agregado" : product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </Button>
            <Link
              to="/carrito"
              className="flex items-center justify-center px-6 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium transition-colors"
            >
              Ver carrito
            </Link>
          </div>

          {/* Volver */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-700 underline self-start"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}