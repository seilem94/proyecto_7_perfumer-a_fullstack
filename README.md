# Perfumería Elegance — Proyecto 7 Fullstack

> Aplicación de comercio electrónico desarrollada como proyecto evaluativo del Módulo 7 del Bootcamp Fullstack. Implementa un e-commerce completo de perfumería de lujo con catálogo de productos, carrito de compras, autenticación JWT, gestión de roles, pasarela de pago real con Stripe y panel de administración completo.

---

## ⚠️ Importante antes de usar la aplicación

El backend está desplegado en **Render** bajo el plan gratuito, lo que significa que **el servidor se duerme tras 15 minutos de inactividad**.

Antes de usar la aplicación, visita el siguiente enlace para despertar el backend y espera a que responda (puede tardar entre 30 y 60 segundos):

👉 **[https://proyecto6-backend-auth-api-perfumeria.onrender.com/api-docs](https://proyecto6-backend-auth-api-perfumeria.onrender.com/api-docs)**

Una vez que la página de Swagger cargue correctamente, el backend está activo y la aplicación funcionará con normalidad.

---

## Índice

- [Demo](#demo)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Descripción del proyecto](#descripción-del-proyecto)
- [Stack tecnológico](#stack-tecnológico)
- [Decisiones técnicas destacadas](#decisiones-técnicas-destacadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Funcionalidades implementadas](#funcionalidades-implementadas)
- [Endpoints de la API](#endpoints-de-la-api)
- [Consumo de la API](#consumo-de-la-api)
- [Autenticación y autorización](#autenticación-y-autorización)
- [Gestión de productos](#gestión-de-productos)
- [Gestión de usuarios](#gestión-de-usuarios)
- [Carrito de compras](#carrito-de-compras)
- [Pasarela de pago con Stripe](#pasarela-de-pago-con-stripe)
- [Gestión de órdenes](#gestión-de-órdenes)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Despliegue](#despliegue)
- [Criterios de evaluación](#criterios-de-evaluación)

---

## Demo

- **Frontend:** [perfumeria-elegance.netlify.app](https://perfumeria-elegance.netlify.app)
- **Backend API:** [proyecto6-backend-auth-api-perfumeria.onrender.com](https://proyecto6-backend-auth-api-perfumeria.onrender.com)
- **Documentación Swagger:** [/api-docs](https://proyecto6-backend-auth-api-perfumeria.onrender.com/api-docs)

> **Tarjeta de prueba Stripe:** `4242 4242 4242 4242` — cualquier fecha futura y cualquier CVV de 3 dígitos.

---

## Rutas de la aplicación

### Rutas públicas — accesibles sin iniciar sesión

| Ruta | Página | Descripción |
|---|---|---|
| `/` | Home | Página de inicio con hero y destacados por categoría |
| `/productos` | Catálogo | Listado de perfumes con filtros y búsqueda |
| `/productos/:id` | Detalle | Vista individual de un perfume con stock en tiempo real |
| `/login` | Login | Formulario de inicio de sesión |
| `/register` | Registro | Formulario de registro con selector de rol |
| `/forgot-password` | Recuperar contraseña | ⚠️ Pendiente de implementar |
| `/reset-password` | Restablecer contraseña | ⚠️ Pendiente de implementar |

### Rutas privadas — requieren estar autenticado

| Ruta | Página | Descripción |
|---|---|---|
| `/carrito` | Carrito | Resumen del carrito con subtotal, envío y total |
| `/checkout` | Checkout | Flujo de compra en 3 pasos con Stripe real |
| `/perfil` | Perfil | Datos del usuario y edición de cuenta |

### Rutas de administración — requieren rol `admin`

| Ruta | Página | Descripción |
|---|---|---|
| `/admin` | Panel de control | Dashboard con métricas del inventario |
| `/admin/productos` | Gestión de productos | Tabla CRUD de perfumes |
| `/admin/productos/crear` | Crear producto | Formulario de nuevo perfume |
| `/admin/productos/editar/:id` | Editar producto | Formulario precargado con datos existentes |
| `/admin/usuarios` | Gestión de usuarios | Tabla de usuarios con control de roles |

---

## Descripción del proyecto

Perfumería Elegance es una tienda en línea de alta perfumería con estética *luxury* desarrollada completamente con el stack MERN. El proyecto abarca desde la experiencia de usuario como visitante anónimo (carrito de invitado) hasta el flujo completo de compra autenticada con Stripe real, registro de órdenes en MongoDB, descuento automático de stock, administración de productos y gestión de roles de usuario.

### Objetivos de aprendizaje aplicados

- Manejo de rutas en el cliente con React Router v6, incluyendo rutas públicas, protegidas y de administrador.
- Manejo de estado global con Context API (`AuthContext`) y Zustand (`useCartStore`).
- Comunicación cliente-servidor con Axios e interceptores de autenticación JWT.
- Registro, login, verificación de token y gestión de sesión con JWT.
- Control de acceso por roles (`user` / `admin`) con middleware `isAdmin` en el backend.
- CRUD completo de productos con panel de administración protegido.
- Gestión de usuarios y cambio de roles desde panel de administración.
- Carrito dual (invitado / autenticado) con migración automática al hacer login.
- Integración real con Stripe usando el patrón PaymentIntent seguro.
- Registro de órdenes en MongoDB con descuento automático de stock al confirmar pago.
- Despliegue en Netlify + Render + MongoDB Atlas.

---

## Stack tecnológico

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | 18 | Framework principal |
| Vite | Latest | Bundler y servidor de desarrollo |
| React Router | v6 | Ruteo del cliente |
| Context API | — | Estado global de autenticación |
| Zustand | Latest | Estado global del carrito |
| Axios | Latest | Comunicación con la API |
| React Hook Form | Latest | Manejo y validación de formularios |
| @stripe/stripe-js | Latest | SDK Stripe para el navegador |
| @stripe/react-stripe-js | Latest | Stripe Elements (campos de tarjeta seguros) |
| Tailwind CSS | v4 | Estilos utilitarios |
| CSS Variables | — | Sistema de diseño luxury (colores, tipografías, sombras) |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | Latest | Entorno de ejecución |
| Express.js | Latest | Framework de servidor |
| MongoDB | Atlas | Base de datos en la nube |
| Mongoose | Latest | ODM para MongoDB |
| JWT | Latest | Generación y validación de tokens |
| bcryptjs | Latest | Hash de contraseñas |
| stripe | Latest | SDK oficial de Stripe para Node |
| express-validator | Latest | Validación de inputs en el servidor |
| cors | Latest | Política de origen cruzado |
| dotenv | Latest | Variables de entorno |
| swagger-jsdoc | Latest | Generación de documentación OpenAPI |
| swagger-ui-express | Latest | Interfaz web de documentación Swagger |

---

## Decisiones técnicas destacadas

### Zustand en lugar de useReducer

El enunciado del proyecto sugiere `useReducer` para el manejo de estado global. En este proyecto se optó por **Zustand** para el estado del carrito, una decisión técnicamente fundamentada:

`useReducer` con Context API requiere definir manualmente el reducer, los action types, el dispatch y el Provider, generando mucho boilerplate. Las operaciones asíncronas como llamadas a la API (agregar al carrito, migrar desde el backend al hacer login) deben manejarse externamente con `useEffect`, separando el estado de la lógica.

**Zustand** resuelve exactamente el mismo problema con una API más concisa: el store contiene tanto el estado como las acciones, incluyendo lógica asíncrona directamente. No requiere Provider ni wrapping de la app, no genera re-renders innecesarios y es la alternativa moderna más adoptada por la comunidad React para este patrón.

```js
// useReducer + Context — boilerplate extenso, async externo
dispatch({ type: 'ADD_ITEM', payload: product });
// lógica de API en useEffect separado...

// Zustand — estado + lógica async en un solo store
const addItem = useCartStore(state => state.addItem);
await addItem(product, quantity); // llama al backend internamente
```

En términos de funcionalidad, resultado y filosofía de estado centralizado, **son equivalentes**. Zustand es una implementación más limpia y mantenible del mismo patrón, y es lo que se enseña en cursos modernos de React como alternativa directa a `useReducer + Context`.

---

### Stripe: por qué no es un BFF y por qué el backend es necesario

Durante el desarrollo se evaluó si Stripe podía implementarse completamente en el frontend siguiendo un patrón **BFF (Backend for Frontend)**, donde el propio frontend actúa como intermediario y elimina la necesidad de lógica adicional en el servidor. La respuesta es **no**, por una razón de seguridad fundamental:

Stripe requiere una `STRIPE_SECRET_KEY` para crear PaymentIntents. Incluir esta clave en el frontend (código JavaScript ejecutado en el navegador del usuario) la haría visible en el código fuente, permitiendo que cualquier persona creara cargos o accediera a la cuenta de Stripe.

El patrón implementado es el **recomendado oficialmente por Stripe**:

```
1. Frontend → POST /api/orders/create-payment-intent { amount, items, shipping }
              Backend usa STRIPE_SECRET_KEY (nunca expuesta) y crea el PaymentIntent
              Backend registra Order(pending) en MongoDB
              Backend devuelve { clientSecret, orderNumber }

2. Frontend → stripe.confirmCardPayment(clientSecret, { card: cardElement })
              Los datos de la tarjeta van directo de Stripe.js a Stripe
              Nunca pasan por el servidor propio

3. Si succeeded → Frontend → POST /api/orders/confirm { paymentIntentId }
              Backend verifica el estado con Stripe (no confía solo en el frontend)
              Backend actualiza Order a paid
              Backend descuenta stock con bulkWrite atómico

4. Webhook (respaldo) → Stripe → POST /api/orders/webhook
              Si el frontend no pudo llamar a /confirm, el webhook lo hace
```

La `STRIPE_PUBLIC_KEY` (usada por Stripe.js en el frontend para inicializar el SDK) puede exponerse sin riesgo — solo sirve para identificar la cuenta, no para realizar operaciones.

---

### Descuento de stock con bulkWrite

Al confirmar una orden, el stock de cada perfume comprado se descuenta en una sola operación atómica usando `bulkWrite` de Mongoose, en lugar de múltiples llamadas secuenciales:

```js
const stockUpdates = order.items.map(item => ({
  updateOne: {
    filter: { _id: item.perfume },
    update: { $inc: { stock: -item.quantity } },
  },
}));
await Perfume.bulkWrite(stockUpdates);
```

Esto garantiza que si el carrito tiene 3 perfumes distintos, solo se realiza 1 operación a la base de datos en lugar de 3, y todos los decrementos se aplican de forma consistente.

---

## Estructura del proyecto

### Frontend
```
src/
├── api/
│   ├── axiosConfig.js        # Instancia Axios con interceptores JWT
│   ├── authService.js        # login, register, verifyToken, updateProfile
│   ├── productService.js     # CRUD de perfumes
│   └── cartService.js        # Operaciones del carrito backend
├── context/
│   └── AuthContext.jsx       # Estado global de autenticación
├── store/
│   └── useCartStore.js       # Estado global del carrito (Zustand)
├── routes/
│   ├── AppRoutes.jsx         # Definición de todas las rutas
│   ├── PrivateRoute.jsx      # Ruta protegida — requiere autenticación
│   └── AdminRoute.jsx        # Ruta protegida — requiere rol admin
├── pages/
│   ├── auth/                 # Login, Register, ForgotPassword, ResetPassword
│   ├── products/             # Products (catálogo + filtros), ProductDetail
│   ├── cart/                 # Cart
│   ├── checkout/             # Checkout con Stripe Elements real (3 pasos)
│   ├── profile/              # Profile
│   └── admin/                # AdminPanel, AdminProducts, AdminCreateProduct, AdminUsers
├── components/
│   ├── common/               # Input, PasswordInput (con medidor de fortaleza), Button
│   ├── layout/               # MainLayout, Navbar
│   └── products/             # ProductCard, ProductFilters
└── utils/
    ├── constants.js          # STORAGE_KEYS, ROUTES, API_BASE_URL
    └── formatters.js         # formatPrice (CLP), formatDate
```

### Backend
```
src/
├── config/
│   ├── db.config.js          # Conexión a MongoDB Atlas
│   ├── env.config.js         # Variables de entorno tipadas (jwt, stripe, cors)
│   └── swagger.config.js     # Configuración Swagger/OpenAPI
├── controllers/
│   ├── cartController.js     # Lógica del carrito backend
│   ├── orderController.js    # Stripe PaymentIntent, confirm, historial, webhook
│   ├── perfumeController.js  # CRUD de perfumes
│   └── userController.js     # Auth, perfil, gestión de usuarios (admin)
├── middlewares/
│   ├── authMiddleware.js     # authenticateToken, isAdmin, generateToken
│   └── errorHandler.js       # notFound, errorHandler global
├── models/
│   ├── cartModel.js          # Carrito del usuario en MongoDB
│   ├── orderModel.js         # Orden de compra con items, shipping, status, paymentIntentId
│   ├── perfumeModel.js       # Catálogo de perfumes
│   └── userModel.js          # Usuarios con roles, bcrypt, toPublicJSON
├── routes/
│   ├── cartRoutes.js         # /api/cart
│   ├── orderRoutes.js        # /api/orders — Stripe + órdenes (con Swagger)
│   ├── perfumeRoutes.js      # /api/perfumes
│   └── userRoutes.js         # /api/users — auth + admin (con Swagger)
└── server.js                 # Express, middlewares, rutas, Swagger UI
```

---

## Funcionalidades implementadas

### Autenticación y sesión
- Registro con validación completa y **selector de rol** (Cliente / Administrador) habilitado para entorno de prueba
- Inicio de sesión con JWT persistido en `localStorage`
- Verificación automática del token al cargar la aplicación (`verifyToken`)
- Cierre de sesión con limpieza de estado y `localStorage`
- Perfil editable (nombre, email)
- Toggle ver/ocultar contraseña en todos los campos de tipo password
- **Indicador de fortaleza de contraseña** en tiempo real al registrarse
- Recuperación de contraseña (`/forgot-password`, `/reset-password`) — **pendiente de implementar** en frontend y backend (requiere servicio de email, endpoints `POST /users/forgot-password` y `PUT /users/reset-password/:token`, y páginas con formularios conectados)

### Control de acceso por roles
- Roles `user` y `admin` persistidos en MongoDB
- Middleware `isAdmin` protege los endpoints de administración en el backend (`GET /users/readall`, `PUT /users/update/:id`, CRUD de perfumes)
- `PrivateRoute` bloquea rutas privadas a usuarios no autenticados
- `AdminRoute` bloquea rutas `/admin/*` a usuarios sin rol admin
- Selector de rol en el registro: el frontend envía `role` al `POST /users/register`, que lo aplica directamente — sin segundo request ni workaround

### Catálogo de productos
- Listado completo desde MongoDB, sin datos mock
- **Filtros combinables:** categoría (Hombre / Mujer / Unisex), precio mínimo, precio máximo, búsqueda por nombre con debounce de 300ms
- Vista de detalle individual con badges de stock (En stock / Stock bajo / Agotado)
- Stock actualizado en tiempo real tras cada compra

### Carrito de compras
- **Dual:** localStorage para usuarios invitados, backend para usuarios autenticados
- **Migración automática** al hacer login — los ítems del carrito invitado se sincronizan con el backend y se limpia `localStorage`
- Ajuste de cantidad, eliminación de ítems y vaciado completo
- Cálculo de envío: gratis sobre $150.000 CLP, $5.990 bajo ese monto
- Contador de ítems en el Navbar sincronizado con el estado global

### Checkout con Stripe real
- **Paso 1:** formulario de datos de envío con validación completa (nombre, apellido, email, teléfono, dirección, ciudad, región, código postal)
- **Paso 2:** Stripe Elements con `CardNumberElement`, `CardExpiryElement`, `CardCvcElement` — los datos de la tarjeta nunca tocan el servidor propio
- **Paso 3:** pantalla de confirmación con número de orden real generado por el backend (`ELG-XXXXXX`)
- El pago es procesado realmente por Stripe en modo test

### Gestión de órdenes
- Al iniciar el pago se crea una `Order(status: pending)` en MongoDB
- Al confirmar el pago exitoso desde Stripe, el backend verifica con Stripe y actualiza a `Order(status: paid)`
- El stock de cada perfume se descuenta automáticamente con `bulkWrite` atómico
- Historial de órdenes disponible en `GET /api/orders/myorders`

### Panel de administración
- **Dashboard** con 4 métricas en tiempo real: total productos, en stock, stock bajo (<10 unidades), valor total del inventario
- **Gestión de productos:** CRUD completo con previsualización de imagen en tiempo real, confirmación antes de eliminar
- **Gestión de usuarios:** tabla con búsqueda por nombre/email, filtro por rol, botones de promover/degradar con modal de confirmación

---

## Endpoints de la API

Base URL: `https://proyecto6-backend-auth-api-perfumeria.onrender.com/api`

### Usuarios — `/users`

| Método | Endpoint | Descripción | Auth | Rol |
|---|---|---|---|---|
| `POST` | `/users/register` | Registrar nuevo usuario (acepta `role`) | No | — |
| `POST` | `/users/login` | Iniciar sesión | No | — |
| `GET` | `/users/verifytoken` | Verificar y renovar JWT | Sí | — |
| `GET` | `/users/getme` | Datos del usuario autenticado | Sí | — |
| `PUT` | `/users/update` | Actualizar perfil propio | Sí | — |
| `DELETE` | `/users/deleteme` | Desactivar cuenta (borrado lógico) | Sí | — |
| `GET` | `/users/readall` | Listar todos los usuarios activos | Sí | admin |
| `PUT` | `/users/update/:id` | Actualizar rol de un usuario | Sí | admin |

### Perfumes — `/perfumes`

| Método | Endpoint | Descripción | Auth | Rol |
|---|---|---|---|---|
| `GET` | `/perfumes/readall` | Listar todos los perfumes | No | — |
| `GET` | `/perfumes/readone/:id` | Obtener perfume por ID | No | — |
| `POST` | `/perfumes/create` | Crear nuevo perfume | Sí | admin |
| `PUT` | `/perfumes/update/:id` | Actualizar perfume | Sí | admin |
| `DELETE` | `/perfumes/delete/:id` | Eliminar perfume | Sí | admin |

### Carrito — `/cart`

| Método | Endpoint | Descripción | Auth | Rol |
|---|---|---|---|---|
| `GET` | `/cart` | Obtener carrito del usuario | Sí | — |
| `POST` | `/cart/add` | Agregar ítem al carrito | Sí | — |
| `PUT` | `/cart/update/:perfumeId` | Actualizar cantidad de un ítem | Sí | — |
| `DELETE` | `/cart/remove/:perfumeId` | Eliminar ítem del carrito | Sí | — |
| `DELETE` | `/cart/clear` | Vaciar el carrito | Sí | — |

### Órdenes / Stripe — `/orders`

| Método | Endpoint | Descripción | Auth | Rol |
|---|---|---|---|---|
| `POST` | `/orders/create-payment-intent` | Crear PaymentIntent + Order(pending) | Sí | — |
| `POST` | `/orders/confirm` | Confirmar pago y actualizar a Order(paid) | Sí | — |
| `GET` | `/orders/myorders` | Historial de órdenes del usuario | Sí | — |
| `GET` | `/orders/payment-intent/:id` | Consultar estado de un PaymentIntent | Sí | — |
| `GET` | `/orders/:id` | Obtener una orden por ID | Sí | — |
| `POST` | `/orders/webhook` | Webhook de Stripe (respaldo) | No* | — |

> *El webhook es público pero verificado con firma criptográfica `STRIPE_WEBHOOK_SECRET`. Si no está configurado, el endpoint responde 200 sin ejecutar acciones.

### Estructura de respuesta

Todos los endpoints siguen la misma estructura:

```json
{
  "success": true,
  "message": "Descripción de la operación",
  "data": {
    // datos aquí
  }
}
```

Los datos siempre están bajo `data`, por lo que en el frontend se accede como `response.data.data`:

```js
const perfumes  = response.data.data.perfumes;     // GET /perfumes/readall
const { clientSecret } = response.data.data;       // POST /orders/create-payment-intent
const cartData  = response.data.data;              // GET /cart
const { user, token } = response.data.data;        // POST /users/login
```

---

## Consumo de la API

### Configuración de Axios

Instancia centralizada con interceptores que adjuntan el JWT automáticamente y redirigen al login cuando el token expira:

```js
// src/api/axiosConfig.js
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response, // devuelve response completo — datos en response.data.data
  (error) => {
    const isVerifyCall = error.config?.url?.includes('verifytoken');
    if (error.response?.status === 401 && !isVerifyCall) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data?.message || 'Error en la petición');
  }
);
```

---

## Autenticación y autorización

### Flujo completo

```
1. Usuario se registra indicando rol (user/admin) — solo en entorno de prueba
2. Backend crea usuario con el rol indicado y devuelve { user, token }
3. Frontend guarda token y user en localStorage
4. AuthContext actualiza isAuthenticated, user, isAdmin en toda la app
5. Cada request incluye Authorization: Bearer <token>
6. Al recargar la app, verifyToken confirma que la sesión sigue válida
7. Si el token expira (401), el interceptor de Axios limpia localStorage y redirige a /login
```

### Middlewares del backend

```js
// authMiddleware.js

// Verifica el JWT y adjunta req.user con el documento del usuario
export const authenticateToken = async (req, res, next) => { ... };

// Verifica rol admin — siempre después de authenticateToken
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado — se requiere rol administrador',
    });
  }
  next();
};

// Genera JWT con expiración configurada en env.jwt.expire
export const generateToken = (id) => jwt.sign({ id }, env.jwt.secret, { expiresIn: env.jwt.expire });
```

### Protección de rutas en el frontend

```jsx
// PrivateRoute — requiere estar autenticado
<Route element={<PrivateRoute />}>
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/perfil"   element={<Profile />} />
  <Route path="/carrito"  element={<Cart />} />
</Route>

// AdminRoute — requiere rol admin
<Route element={<AdminRoute />}>
  <Route path="/admin"                      element={<AdminPanel />} />
  <Route path="/admin/productos"            element={<AdminProducts />} />
  <Route path="/admin/productos/crear"      element={<AdminCreateProduct />} />
  <Route path="/admin/productos/editar/:id" element={<AdminCreateProduct />} />
  <Route path="/admin/usuarios"             element={<AdminUsers />} />
</Route>
```

---

## Gestión de productos

CRUD completo desde `/admin/productos`, protegido por doble middleware `authenticateToken + isAdmin`:

- **Crear** (`/admin/productos/crear`): formulario con nombre, marca, descripción, precio, stock, categoría e imagen. Previsualización de imagen en tiempo real.
- **Leer** (`/admin/productos`): tabla con búsqueda por nombre y filtro por estado de stock. Dashboard con métricas calculadas en el frontend desde los datos del backend.
- **Editar** (`/admin/productos/editar/:id`): mismo formulario precargado con `getProductById`, reutilizando el componente `AdminCreateProduct`.
- **Eliminar**: modal de confirmación con el nombre del producto para evitar borrados accidentales.

---

## Gestión de usuarios

Desde `/admin/usuarios`, exclusivo para administradores:

- Tabla con todos los usuarios activos (`isActive: true`) del sistema
- Búsqueda en tiempo real por nombre o email
- Filtro por rol (Todos / Admin / Cliente)
- Stats cards: total usuarios, cantidad de admins, cantidad de clientes
- Botones **Hacer admin** / **Quitar admin** con modal de confirmación

```
Admin selecciona usuario → confirma en modal
→ PUT /api/users/update/:id { role: 'admin' | 'user' }
→ Backend actualiza en MongoDB y devuelve user actualizado
→ Tabla se actualiza sin recargar la página
```

---

## Carrito de compras

### Sistema dual invitado / autenticado

```
Usuario invitado:
  addItem() → guarda en localStorage (STORAGE_KEYS.GUEST_CART)
  removeItem() / updateQuantity() → actualiza localStorage

Usuario autenticado:
  addItem() → POST /cart/add → fetchCartFromBackend()
  removeItem() → DELETE /cart/remove/:id → fetchCartFromBackend()

Al hacer login (migrateGuestCart):
  1. Copia ítems del guest cart
  2. Marca isGuest = false
  3. POST /cart/add por cada ítem → sincroniza con backend
  4. Limpia localStorage
  5. GET /cart → estado final del servidor
```

### Estado global con Zustand

```js
const {
  items,
  totalItems,
  totalPrice,
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
  migrateGuestCart,
} = useCartStore();
```

---

## Pasarela de pago con Stripe

### Flujo técnico completo (Opción C — sin dependencia de webhook)

```
PASO 1 — Datos de envío
  Usuario completa el formulario → datos guardados en estado (shippingInfo)

PASO 2 — Pago con Stripe Elements
  CardNumberElement, CardExpiryElement, CardCvcElement
  Los datos de tarjeta NUNCA pasan por el servidor propio

Al hacer clic en "Pagar":

  1. POST /api/orders/create-payment-intent
     { amount, items, shipping: shippingInfo, subtotal, shippingCost }
     → Backend crea PaymentIntent en Stripe con STRIPE_SECRET_KEY
     → Backend crea Order(status: pending) en MongoDB
     → Backend devuelve { clientSecret, paymentIntentId, orderNumber }

  2. stripe.confirmCardPayment(clientSecret, { card: cardElement })
     → Stripe procesa el pago directamente
     → Devuelve { paymentIntent: { status: 'succeeded' } }

  3. POST /api/orders/confirm { paymentIntentId }
     → Backend verifica el estado con Stripe (no confía solo en el frontend)
     → Backend actualiza Order a status: paid
     → Backend ejecuta bulkWrite para descontar stock de cada perfume

PASO 3 — Confirmación
  clearCart() — carrito limpiado
  Pantalla de confirmación con orderNumber real (ELG-XXXXXX)
```

### CLP — zero-decimal currency

El peso chileno es una **zero-decimal currency** en Stripe. El monto se envía en pesos exactos sin multiplicar por 100:

```js
// Correcto para CLP
stripe.paymentIntents.create({ amount: 149990, currency: 'clp' });

// Incorrecto (para USD, EUR, etc. que usan centavos)
stripe.paymentIntents.create({ amount: 14999000, currency: 'clp' });
```

### Webhook (respaldo)

El webhook de Stripe (`POST /api/orders/webhook`) actúa como respaldo para casos donde el usuario cierra el browser antes de que el frontend pueda llamar a `/confirm`. Solo actualiza órdenes que aún estén en `pending`, evitando doble descuento de stock si `/confirm` ya fue llamado.

---

## Gestión de órdenes

### Modelo Order en MongoDB

```
Order {
  user:            ObjectId (ref: User)
  items: [{
    perfume:       ObjectId (ref: Perfume)
    name:          String
    quantity:      Number
    price:         Number
  }]
  shipping: {
    firstName, lastName, email, phone,
    address, city, region, zip
  }
  subtotal:        Number (CLP)
  shippingCost:    Number (CLP)
  total:           Number (CLP)
  currency:        String (default: 'clp')
  status:          'pending' | 'paid' | 'failed' | 'cancelled'
  paymentIntentId: String (unique — ID de Stripe)
  orderNumber:     String (unique — formato ELG-XXXXXX, generado automáticamente)
  createdAt:       Date
}
```

### Endpoints de órdenes

| Endpoint | Cuándo se llama | Qué hace |
|---|---|---|
| `POST /orders/create-payment-intent` | Al hacer clic en "Pagar" | Crea PaymentIntent + Order(pending) |
| `POST /orders/confirm` | Cuando Stripe confirma el pago | Actualiza a paid + descuenta stock |
| `GET /orders/myorders` | Historial de compras del usuario | Lista todas las órdenes del usuario |
| `GET /orders/:id` | Ver detalle de una orden | Retorna la orden completa |

---

## Variables de entorno

### Frontend (`.env`)
```env
VITE_API_BASE_URL=https://proyecto6-backend-auth-api-perfumeria.onrender.com/api
VITE_API_VERSION=v1
VITE_APP_NAME=Perfumería Elegance
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Backend (`.env`)
```env
PORT=3000
SERVER_URL=https://proyecto6-backend-auth-api-perfumeria.onrender.com
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRE=7d
CORS_ORIGIN=https://perfumeria-elegance.netlify.app
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

> Las claves de Stripe se obtienen en [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys) — asegurarse de estar en modo **Test**.

---

## Instalación y ejecución local

```bash
# Clonar repositorio
git clone https://github.com/seilem94/perfumeria-elegance.git
cd perfumeria-elegance

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env
# Completar con las claves correspondientes

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

### Configuración Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Variables de entorno: `VITE_API_BASE_URL`, `VITE_API_VERSION`, `VITE_APP_NAME`, `VITE_STRIPE_PUBLIC_KEY`
- Archivo `/public/_redirects` para React Router:
  ```
  /* /index.html 200
  ```

### Configuración Render
Variables de entorno requeridas: `PORT`, `SERVER_URL`, `NODE_ENV`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `CORS_ORIGIN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### Configuración Webhook Stripe (opcional)
- Dashboard Stripe → Webhooks → Add endpoint
- URL: `https://proyecto6-backend-auth-api-perfumeria.onrender.com/api/orders/webhook`
- Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copiar el Signing secret como `STRIPE_WEBHOOK_SECRET` en Render

---

## Criterios de evaluación

| Área | % | Estado |
|---|---|---|
| Implementación gestión de productos | 30% | ✅ CRUD completo con panel admin |
| Implementación autenticación | 30% | ✅ JWT + roles + rutas protegidas |
| Implementación pasarela de pagos eCommerce | 20% | ✅ Stripe real con PaymentIntent |
| Despliegue | 20% | ✅ Netlify + Render + MongoDB Atlas |
| Entrega a tiempo | 10% | ✅ |

### Detalle por criterio

**Gestión de productos (30%):** CRUD completo desde panel de administración protegido por doble middleware `authenticateToken + isAdmin`. Catálogo público con filtros combinables por categoría, precio y búsqueda con debounce de 300ms. Vista de detalle individual con stock en tiempo real. Dashboard con 4 métricas del inventario. Stock decrementado automáticamente con `bulkWrite` al confirmar cada compra.

**Autenticación (30%):** Registro y login con JWT. Selector de rol en el registro (entorno de prueba) — el rol se aplica directamente en `POST /users/register` sin segundo request. Verificación automática de token al cargar la app. `PrivateRoute` y `AdminRoute` en el frontend. Middleware `isAdmin` en el backend. Panel de gestión de usuarios con cambio de rol en tiempo real. Perfil editable. Indicador de fortaleza de contraseña. Toggle ver/ocultar contraseña. **Zustand** reemplaza `useReducer` con la misma filosofía de estado centralizado, soporte nativo para async y sin boilerplate de Provider ni action types.

**Pasarela de pagos (20%):** Integración real con Stripe en modo test usando el patrón PaymentIntent recomendado oficialmente. `STRIPE_SECRET_KEY` nunca expuesta al cliente. Stripe Elements (`CardNumberElement`, `CardExpiryElement`, `CardCvcElement`) para captura segura de datos de tarjeta. Flujo Opción C: `create-payment-intent` → `confirmCardPayment` → `confirm` — sin dependencia de webhook. CLP tratada correctamente como zero-decimal currency. Órdenes registradas en MongoDB con descuento automático de stock.

**Despliegue (20%):** Frontend en Netlify con variables de entorno y `_redirects` para React Router. Backend en Render con todas las variables configuradas. MongoDB Atlas como base de datos en la nube. Documentación Swagger completa en producción incluyendo todos los endpoints de usuarios, perfumes, carrito y órdenes/Stripe.

---

## Autor

**Salem Hidd**
Bootcamp Fullstack — Módulo 7
