import { useEffect, useState, useCallback } from "react";
import { productService } from "../../api/productService";
import { formatPrice } from "../../utils/formatters";
import { CATEGORIES } from "../../utils/constants";

// ── Formulario de producto (crear / editar) ──────────────────────────────────
const EMPTY_FORM = {
  name: "",
  brand: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  image: "",
};

function ProductForm({ initial = EMPTY_FORM, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Nombre requerido";
    if (!form.brand.trim()) errs.brand = "Marca requerida";
    if (!form.price || Number(form.price) <= 0) errs.price = "Precio inválido";
    if (form.stock === "" || Number(form.stock) < 0) errs.stock = "Stock inválido";
    if (!form.category) errs.category = "Categoría requerida";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
  };

  const field = (label, key, type = "text", extra = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={set(key)}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
          errors[key] ? "border-red-400" : "border-gray-300"
        }`}
        {...extra}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Nombre *", "name", "text", { placeholder: "Chanel Nº5" })}
        {field("Marca *", "brand", "text", { placeholder: "Chanel" })}
        {field("Precio (CLP) *", "price", "number", { min: 0, placeholder: "50000" })}
        {field("Stock *", "stock", "number", { min: 0, placeholder: "10" })}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría *
        </label>
        <select
          value={form.category}
          onChange={set("category")}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            errors.category ? "border-red-400" : "border-gray-300"
          }`}
        >
          <option value="">Seleccionar...</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-red-500 mt-1">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={form.description}
          onChange={set("description")}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder="Descripción del perfume..."
        />
      </div>

      {field("URL de imagen", "image", "url", {
        placeholder: "https://...",
      })}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50"
        >
          {loading ? "Guardando..." : initial === EMPTY_FORM ? "Crear producto" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ── Modal genérico ────────────────────────────────────────────────────────────
function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Panel Admin principal ─────────────────────────────────────────────────────
export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal state: null | 'create' | { mode: 'edit', product }
  const [modal, setModal] = useState(null);

  // Confirmación de borrado
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Búsqueda local
  const [search, setSearch] = useState("");

  const notify = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getAllProducts();
      setProducts(res.data.perfumes || res.data || []);
    } catch (err) {
      setError("No se pudieron cargar los productos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── CRUD handlers ───────────────────────────────────────────────────────────
  const handleCreate = async (data) => {
    setFormLoading(true);
    try {
      await productService.createProduct(data);
      notify("✅ Producto creado correctamente");
      setModal(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el producto");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      await productService.updateProduct(modal.product._id, data);
      notify("✅ Producto actualizado correctamente");
      setModal(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar el producto");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await productService.deleteProduct(deleteTarget._id);
      notify("🗑️ Producto eliminado");
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar el producto");
      setDeleteTarget(null);
    }
  };

  // ── Filtro local ────────────────────────────────────────────────────────────
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel Admin</h1>
          <p className="text-gray-500 mt-1">
            {products.length} productos en total
          </p>
        </div>
        <button
          onClick={() => setModal("create")}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
        >
          + Nuevo producto
        </button>
      </div>

      {/* Notificaciones */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-4 py-3 text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm flex justify-between">
          {error}
          <button onClick={() => setError(null)} className="ml-4 font-bold">×</button>
        </div>
      )}

      {/* Buscador local */}
      <input
        type="text"
        placeholder="Buscar por nombre o marca..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
      />

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No se encontraron productos.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Producto", "Marca", "Categoría", "Precio", "Stock", "Acciones"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-semibold text-gray-700"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={product.image || "https://via.placeholder.com/40"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.brand}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.category === "Hombre"
                            ? "bg-blue-100 text-blue-800"
                            : product.category === "Mujer"
                            ? "bg-pink-100 text-pink-800"
                            : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-purple-600">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold ${
                          product.stock > 10
                            ? "text-emerald-600"
                            : product.stock > 0
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setModal({ mode: "edit", product })}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Crear */}
      {modal === "create" && (
        <Modal title="Nuevo producto" onClose={() => setModal(null)}>
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setModal(null)}
            loading={formLoading}
          />
        </Modal>
      )}

      {/* Modal Editar */}
      {modal?.mode === "edit" && (
        <Modal title="Editar producto" onClose={() => setModal(null)}>
          <ProductForm
            initial={{
              name: modal.product.name || "",
              brand: modal.product.brand || "",
              description: modal.product.description || "",
              price: modal.product.price || "",
              stock: modal.product.stock || "",
              category: modal.product.category || "",
              image: modal.product.image || "",
            }}
            onSubmit={handleUpdate}
            onCancel={() => setModal(null)}
            loading={formLoading}
          />
        </Modal>
      )}

      {/* Modal Confirmar Borrado */}
      {deleteTarget && (
        <Modal title="Confirmar eliminación" onClose={() => setDeleteTarget(null)}>
          <div className="text-center space-y-4">
            <span className="text-5xl block">🗑️</span>
            <p className="text-gray-700">
              ¿Estás seguro de que quieres eliminar{" "}
              <strong>{deleteTarget.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}