import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  return (
    <Card className="group hover:shadow-xl transition-all overflow-hidden">
      {/* Imagen */}
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden mb-4 group-hover:scale-105 transition-transform">
        <img
          src={product.image || `https://via.placeholder.com/300x300/${product.category === 'Hombre' ? '4169E1' : 'FF69B4'}/FFFFFF?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="space-y-3 p-1">
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-semibold text-gray-600">{product.brand}</p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-purple-600">
              {formatPrice(product.price)}
            </span>
            <span className={`px-2 py-px text-xs font-bold rounded-full ${
              product.stock > 10 ? 'bg-emerald-100 text-emerald-800' :
              product.stock > 0 ? 'bg-amber-100 text-amber-800' :
              'bg-red-100 text-red-800'
            }`}>
              {product.stock} stock
            </span>
          </div>

          <div className="flex gap-1">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              product.category === 'Hombre' ? 'bg-blue-100 text-blue-800' :
              product.category === 'Mujer' ? 'bg-pink-100 text-pink-800' :
              'bg-indigo-100 text-indigo-800'
            }`}>
              {product.category}
            </span>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          variant="primary"
          className="w-full mt-4"
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </div>
    </Card>
  );
};
