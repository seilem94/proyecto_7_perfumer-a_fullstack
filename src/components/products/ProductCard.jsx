import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault(); // evita navegar si el card es clickeable
    addItem(product, 1);
  };

  return (
    <Card className="group hover:shadow-xl transition-all overflow-hidden flex flex-col">
      {/* Imagen — clickeable al detalle */}
      <Link to={`/productos/${product._id}`} className="block">
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-4 group-hover:scale-105 transition-transform">
          <img
            src={
              product.image ||
              `https://via.placeholder.com/300x300/${
                product.category === 'Hombre' ? '4169E1' : 'FF69B4'
              }/FFFFFF?text=${encodeURIComponent(product.name)}`
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Contenido */}
      <div className="space-y-3 p-1 flex flex-col flex-1">
        <div>
          <Link to={`/productos/${product._id}`}>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm font-semibold text-gray-600">{product.brand}</p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-purple-600">
              {formatPrice(product.price)}
            </span>
            <span
              className={`px-2 py-px text-xs font-bold rounded-full ${
                product.stock > 10
                  ? 'bg-emerald-100 text-emerald-800'
                  : product.stock > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {product.stock > 0 ? `${product.stock} stock` : 'Sin stock'}
            </span>
          </div>

          <div className="flex gap-1">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                product.category === 'Hombre'
                  ? 'bg-blue-100 text-blue-800'
                  : product.category === 'Mujer'
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              {product.category}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleAddToCart}
            variant="primary"
            className="flex-1"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </Button>
          <Link
            to={`/productos/${product._id}`}
            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Ver
          </Link>
        </div>
      </div>
    </Card>
  );
};