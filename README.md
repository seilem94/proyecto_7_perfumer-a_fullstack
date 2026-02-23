# Perfumería Elegance — Proyecto 7 Fullstack

> Aplicación de comercio electrónico desarrollada como proyecto evaluativo del Módulo 7 del Bootcamp Fullstack. Implementa un e-commerce completo de perfumería de lujo con catálogo de productos, carrito de compras, autenticación JWT, gestión de roles y pasarela de pago simulada.

---

## Índice

- [Demo](#demo)
- [Descripción del proyecto](#descripción-del-proyecto)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Funcionalidades implementadas](#funcionalidades-implementadas)
- [Endpoints de la API](#endpoints-de-la-api)
- [Consumo de la API](#consumo-de-la-api)
- [Autenticación y autorización](#autenticación-y-autorización)
- [Gestión de productos](#gestión-de-productos)
- [Carrito de compras](#carrito-de-compras)
- [Pasarela de pago](#pasarela-de-pago)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Despliegue](#despliegue)
- [Criterios de evaluación](#criterios-de-evaluación)

---

## Demo

- **Frontend desplegado:** [perfumeria-elegance.netlify.app](https://perfumeria-elegance.netlify.app)
- **Backend API:** [proyecto6-backend-auth-api-perfumeria.onrender.com](https://proyecto6-backend-auth-api-perfumeria.onrender.com)
- **Documentación Swagger:** [/api-docs](https://proyecto6-backend-auth-api-perfumeria.onrender.com/api-docs)

> Para probar el flujo de pago, use la tarjeta de prueba: `4242 4242 4242 4242` con cualquier fecha futura y CVV.

---

## Descripción del proyecto

Perfumería Elegance es una tienda en línea de alta perfumería con estética *luxury* desarrollada completamente con el stack MERN. El proyecto abarca desde la experiencia de usuario como visitante anónimo (carrito de invitado) hasta el flujo completo de compra autenticada, administración de productos y gestión de roles de usuario.

### Objetivos de aprendizaje aplicados

- Manejo de rutas en el cliente con React Router v6, incluyendo rutas públicas, protegidas y de administrador.
- Manejo de estado global con Context API (`AuthContext`) y Zustand (`useCartStore`).
- Comunicación cliente-servidor mediante Axios con interceptores de autenticación.
- Implementación de autenticación y autorización con JWT en el frontend.
- Gestión de roles (`user` / `admin`) para control de acceso a áreas privadas.
- CRUD completo de productos desde un panel de administración.
- Flujo de carrito persistente para usuarios invitados con migración al backend al iniciar sesión.
- Despliegue en Netlify (frontend) y Render (backend) con MongoDB Atlas como base de datos.

---

## Stack tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| React 18 + Vite | Framework y bundler |
| React Router v6 | Ruteo del cliente |
| Context API | Estado global de autenticación |
| Zustand | Estado global del carrito |
| Axios | Comunicación con la API |
| React Hook Form | Manejo y validación de formularios |
| Tailwind CSS v4 | Estilos utilitarios |
| CSS Variables | Sistema de diseño luxury (tipografías, colores, sombras) |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express.js | Servidor y rutas API |
| MongoDB + Mongoose | Base de datos y modelos |
| JWT | Generación y validación de tokens |
| bcryptjs | Hash de contraseñas |
| cors | Política de origen cruzado |
| dotenv | Variables de entorno |
| Swagger UI | Documentación interactiva de la API |

---

## Estructura del proyecto

```
src/
├── api/
│   ├── axiosConfig.js        # Instancia Axios con interceptores
│   ├── authService.js        # Servicios de autenticación
│   ├── productService.js     # Servicios de productos (CRUD)
│   └── cartService.js        # Servicios del carrito
├── context/
│   └── AuthContext.jsx       # Contexto global de autenticación
├── store/
│   └── useCartStore.js       # Estado global del carrito (Zustand)
├── routes/
│   ├── AppRoutes.jsx         # Definición de rutas
│   ├── PrivateRoute.jsx      # Ruta protegida por autenticación
│   └── AdminRoute.jsx        # Ruta protegida por rol admin
├── pages/
│   ├── auth/                 # Login, Register, ForgotPassword, ResetPassword
│   ├── products/             # Products, ProductDetail
│   ├── cart/                 # Cart
│   ├── checkout/             # Checkout (3 pasos)
│   ├── profile/              # Profile
│   └── admin/                # AdminPanel, AdminProducts, AdminCreateProduct, AdminUsers
├── components/
│   ├── common/               # Input, PasswordInput, Button, Card
│   ├── layout/               # MainLayout, Navbar
│   └── products/             # ProductCard, ProductFilters
└── utils/
    ├── constants.js          # Constantes globales y rutas
    └── formatters.js         # Formateadores de precio y fecha
```

---

## Funcionalidades implementadas

### Usuarios / Autenticación
- Registro de cuenta nueva con validación de formulario
- Inicio de sesión con JWT persistido en `localStorage`
- Verificación de token al cargar la aplicación (`verifyToken`)
- Cierre de sesión con limpieza de estado y almacenamiento local
- Perfil de usuario editable (nombre, email)
- Protección de rutas por autenticación y por rol
- Indicador de fortaleza de contraseña en formularios de registro
- Toggle ver/ocultar contraseña en todos los campos de tipo password
- Páginas de recuperación de contraseña preparadas para conectar al backend
- Selector de rol (Cliente / Administrador) al momento del registro, habilitado para entorno de prueba

### Gestión de roles
- Roles `user` y `admin` gestionados desde el backend
- Panel de administración de usuarios para promover/degradar roles
- `AdminRoute` bloquea el acceso a rutas `/admin/*` para usuarios sin rol admin

### Catálogo de productos
- Listado de todos los perfumes desde el backend
- Filtros por categoría (Hombre / Mujer / Unisex), precio mínimo, precio máximo y búsqueda por nombre
- Vista de detalle individual de cada producto
- Badges de stock (En stock / Stock bajo / Agotado)

### Carrito de compras
- Carrito persistente para usuarios **invitados** (localStorage)
- Carrito sincronizado con el backend para usuarios **autenticados**
- Migración automática del carrito invitado al backend al iniciar sesión
- Ajuste de cantidad, eliminación de ítems y vaciado completo
- Cálculo de envío (gratis sobre $150.000 CLP)
- Redirección a login con retorno al checkout para usuarios no autenticados

### Checkout
- Flujo de 3 pasos: Envío → Pago → Confirmación
- Formulario de datos de envío con validación completa
- Formulario de pago mock (Stripe UI simulada) con formateo automático de campos
- Número de orden generado aleatoriamente al confirmar
- Limpieza del carrito tras pago exitoso

### Panel de administración
- Dashboard con estadísticas del inventario (total, en stock, stock bajo, valor total)
- CRUD completo de perfumes (crear, leer, editar, eliminar)
- Previsualización de imagen en tiempo real al crear/editar
- Confirmación antes de eliminar productos
- Gestión de roles de usuarios (promover a admin / quitar admin)

---

## Endpoints de la API

Base URL: `https://proyecto6-backend-auth-api-perfumeria.onrender.com/api`

### Autenticación — `/users`

| Método | Endpoint | Descripción | Auth requerida |
|---|---|---|---|
| `POST` | `/users/register` | Crear cuenta nueva | No |
| `POST` | `/users/login` | Iniciar sesión | No |
| `GET` | `/users/verifytoken` | Verificar validez del JWT | Sí |
| `PUT` | `/users/update` | Actualizar perfil del usuario | Sí |
| `GET` | `/users/readall` | Listar todos los usuarios | Sí (admin) |
| `PUT` | `/users/update/:id` | Actualizar rol de un usuario | Sí (admin) |

### Perfumes — `/perfumes`

| Método | Endpoint | Descripción | Auth requerida |
|---|---|---|---|
| `GET` | `/perfumes/readall` | Listar todos los perfumes | No |
| `GET` | `/perfumes/readone/:id` | Obtener perfume por ID | No |
| `POST` | `/perfumes/create` | Crear nuevo perfume | Sí (admin) |
| `PUT` | `/perfumes/update/:id` | Actualizar perfume | Sí (admin) |
| `DELETE` | `/perfumes/delete/:id` | Eliminar perfume | Sí (admin) |

### Carrito — `/cart`

| Método | Endpoint | Descripción | Auth requerida |
|---|---|---|---|
| `GET` | `/cart` | Obtener carrito del usuario | Sí |
| `POST` | `/cart/add` | Agregar ítem al carrito | Sí |
| `PUT` | `/cart/update/:perfumeId` | Actualizar cantidad de un ítem | Sí |
| `DELETE` | `/cart/remove/:perfumeId` | Eliminar ítem del carrito | Sí |
| `DELETE` | `/cart/clear` | Vaciar el carrito | Sí |

### Estructura de respuesta del backend

Todos los endpoints siguen una estructura consistente:

```json
{
  "success": true,
  "message": "Descripción de la operación",
  "data": {
    // Datos de la respuesta
  }
}
```

Ejemplo de respuesta de login:
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "699b36b2586b5dd952e0639c",
      "name": "Salem Hidd",
      "email": "salemhidd1994@gmail.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Consumo de la API

### Configuración de Axios

Se utiliza una instancia centralizada de Axios con interceptores para adjuntar automáticamente el token JWT en cada petición y manejar errores globales:

```js
// src/api/axiosConfig.js
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de request — adjunta el token en cada petición
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de response — maneja errores globales
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado — limpiar sesión y redirigir al login
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data?.message || 'Error en la petición');
  }
);
```

### Servicios por módulo

Cada módulo tiene su propio archivo de servicio que centraliza las llamadas:

```js
// Ejemplo: src/api/productService.js
export const productService = {
  getAllProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await axiosInstance.get(`/perfumes/readall?${params.toString()}`);
  },
  getProductById: async (id) => axiosInstance.get(`/perfumes/readone/${id}`),
  createProduct: async (data) => axiosInstance.post('/perfumes/create', data),
  updateProduct: async (id, data) => axiosInstance.put(`/perfumes/update/${id}`, data),
  deleteProduct: async (id) => axiosInstance.delete(`/perfumes/delete/${id}`),
};
```

### Lectura de respuestas anidadas

El backend devuelve los datos con dos niveles de anidamiento (`response.data.data`). Todos los servicios y hooks contemplan esta estructura:

```js
// Correcto — la API responde: { success, data: { perfumes: [...] } }
const response = await productService.getAllProducts();
const perfumes = response.data.data.perfumes;

// Incorrecto — no acceder directamente a response.data.perfumes
```

---

## Autenticación y autorización

### Flujo de autenticación

```
1. Usuario completa formulario de login/registro
2. Frontend envía credenciales al backend
3. Backend valida, genera JWT y responde con { user, token }
4. Frontend guarda token y user en localStorage
5. AuthContext actualiza el estado global (isAuthenticated, user)
6. Cada petición subsiguiente incluye el token en el header Authorization
7. Al recargar la app, verifyToken confirma que el token sigue válido
```

### AuthContext

```jsx
// Estado global de autenticación disponible en toda la app
const { user, isAuthenticated, isAdmin, login, logout, register, updateUser } = useAuth();
```

### Protección de rutas

```jsx
// PrivateRoute — requiere estar autenticado
<Route element={<PrivateRoute />}>
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/perfil" element={<Profile />} />
</Route>

// AdminRoute — requiere rol admin
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminPanel />} />
  <Route path="/admin/productos" element={<AdminProducts />} />
</Route>
```

### Verificación de token al inicio

Al montar la aplicación, `AuthContext` verifica automáticamente si el token guardado sigue siendo válido:

```js
useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && savedUser && savedUser !== 'undefined') {
      try {
        await authService.verifyToken(); // GET /users/verifytoken
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (err) {
        if (err?.status === 401) logout(); // Token expirado
      }
    }
    setLoading(false);
  };
  initAuth();
}, []);
```

---

## Gestión de productos

El panel de administración implementa CRUD completo:

- **Crear:** formulario con validación de campos obligatorios, previsualización de imagen en tiempo real y precio formateado en CLP.
- **Leer:** tabla con búsqueda, filtro por estado de stock y estadísticas del inventario.
- **Actualizar:** mismo formulario de creación reutilizado, precargado con los datos del producto existente.
- **Eliminar:** modal de confirmación con nombre del producto para evitar borrados accidentales. Toast de feedback tras la operación.

---

## Carrito de compras

### Carrito dual (invitado / autenticado)

```
Usuario invitado:
  └── addItem() → guarda en localStorage (STORAGE_KEYS.GUEST_CART)

Usuario autenticado:
  └── addItem() → POST /cart/add → fetchCartFromBackend()

Al hacer login:
  └── migrateGuestCart() → itera ítems del localStorage → POST /cart/add por cada ítem
                        → limpia localStorage → GET /cart (estado final del backend)
```

### Estado del carrito con Zustand

```js
const { items, totalItems, totalPrice, addItem, removeItem, updateItemQuantity, clearCart } = useCartStore();
```

---

## Pasarela de pago

Se implementó un flujo de checkout de 3 pasos con UI que simula Stripe:

1. **Envío:** formulario con nombre, email, teléfono, dirección, ciudad, región y código postal.
2. **Pago:** inputs con formateo automático (número de tarjeta en grupos de 4, expiración MM/AA, CVV). Tarjeta de prueba: `4242 4242 4242 4242`.
3. **Confirmación:** número de orden generado, resumen del pedido y redirección al home.

> La integración real con Stripe está preparada para implementarse en el backend — el frontend ya consume la estructura de flujo esperada.

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto frontend:

```env
VITE_API_BASE_URL=https://proyecto6-backend-auth-api-perfumeria.onrender.com/api
VITE_API_VERSION=v1
VITE_APP_NAME=Perfumería Elegance
```

---

## Instalación y ejecución local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/perfumeria-elegance.git
cd perfumeria-elegance

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env

# Ejecutar en modo desarrollo
npm run dev

# Build para producción
npm run build
```

---

## Despliegue

| Servicio | Plataforma | URL |
|---|---|---|
| Frontend | Netlify | `perfumeria-elegance.netlify.app` |
| Backend | Render | `proyecto6-backend-auth-api-perfumeria.onrender.com` |
| Base de datos | MongoDB Atlas | Cluster en la nube |

**Configuración en Netlify:**
- Build command: `npm run build`
- Publish directory: `dist`
- Variables de entorno: `VITE_API_BASE_URL`, `VITE_API_VERSION`, `VITE_APP_NAME`
- Archivo `_redirects` en `/public`:
  ```
  /* /index.html 200
  ```
  Este archivo es necesario para que React Router funcione correctamente con rutas del lado del cliente en Netlify.

---

## Criterios de evaluación

| Área | % | Estado |
|---|---|---|
| Implementación gestión de productos | 30% | ✅ CRUD completo con panel admin |
| Implementación autenticación | 30% | ✅ JWT + roles + rutas protegidas |
| Implementación pasarela de pagos eCommerce | 20% | ✅ Checkout 3 pasos + Stripe mock |
| Despliegue | 20% | ✅ Netlify + Render + MongoDB Atlas |
| Entrega a tiempo | 10% | ✅ |

### Detalle por criterio

**Gestión de productos (30%):** Implementado CRUD completo desde panel de administración con autenticación de rol. Catálogo público con filtros por categoría, precio y búsqueda. Vista de detalle individual. Badges de stock en tiempo real.

**Autenticación (30%):** Registro y login con JWT. Verificación de token al cargar la aplicación. Rutas privadas con `PrivateRoute` y `AdminRoute`. Gestión de roles user/admin con panel dedicado. Perfil de usuario editable. Indicador de fortaleza de contraseña. Toggle ver/ocultar contraseña. Selector de rol en el registro (habilitado para entorno de prueba).

**Pasarela de pagos (20%):** Flujo de checkout de 3 pasos (envío, pago, confirmación). UI de Stripe con formateo automático de inputs. Carrito con cálculo de subtotal, envío y total. Migración de carrito de invitado a usuario autenticado.

**Despliegue (20%):** Frontend en Netlify con variables de entorno configuradas. Backend en Render. Base de datos en MongoDB Atlas. Documentación Swagger disponible en producción.

---

## Autor

**Salem Hidd**
Bootcamp Fullstack — Módulo 7
