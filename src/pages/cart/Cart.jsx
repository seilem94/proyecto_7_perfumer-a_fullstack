import { useCartStore } from "../../store/useCartStore";
import { formatPrice } from "../../utils/formatters";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { Link } from "react-router-dom";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Carrito</h1>
        <p className="text-xl text-gray-600">
          {totalItems} {totalItems === 1 ? "producto" : "productos"}
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🛒</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gray-500 mb-8">
            ¡Aprovecha nuestras ofertas y llena tu carrito!
          </p>
          <Button as={Link} to="/productos" className="px-8 py-3 text-lg">
            Continuar comprando
          </Button>
        </Card>
      ) : (
        <>
          {/* Items del carrito */}
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.perfume._id} className="p-6">
                <div className="flex gap-4">
                  {/* Imagen */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.perfume.image}
                      alt={item.perfume.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Detalles */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">
                      {item.perfume.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {item.perfume.brand} • {item.perfume.category}
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      {/* Cantidad */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateItemQuantity(
                              item.perfume._id,
                              item.quantity - 1,
                            )
                          }
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateItemQuantity(
                              item.perfume._id,
                              item.quantity + 1,
                            )
                          }
                          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Precio unitario */}
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(item.price)}
                      </span>

                      {/* Subtotal */}
                      <span className="text-xl font-bold text-purple-600 ml-auto">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.perfume._id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Resumen */}
          <Card className="sticky bottom-0 p-6 lg:max-w-md mx-auto lg:ml-auto">
            <h3 className="text-xl font-bold mb-4">Resumen del pedido</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-lg">
                <span>Total productos:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-purple-600">
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full text-lg py-4" variant="primary">
                Finalizar compra
              </Button>
              <Button
                onClick={clearCart}
                variant="secondary"
                className="w-full text-lg py-4"
              >
                Vaciar carrito
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
