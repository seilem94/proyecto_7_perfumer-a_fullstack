import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const ProductCard = ({ product }) => {
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <Card className="group hover:shadow-xl transition-all">
      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform">
        <img
          src={product.image || 'https://via.placeholder.com/300x300/6B46C1/FFFFFF?text=Perfume'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.brand}</p>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">
            {formatPrice(product.price)}
          </span>
          <div className="flex gap-1 text-xs">
            <span className={`px-2 py-1 rounded-full font-medium ${
              product.category === 'Hombre' ? 'bg-blue-100 text-blue-800' :
              product.category === 'Mujer' ? 'bg-pink-100 text-pink-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {product.category}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              {product.stock} disponibles
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
