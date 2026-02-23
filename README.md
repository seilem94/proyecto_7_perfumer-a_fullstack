# Perfumería Elegance — Proyecto 7 Fullstack

> Aplicación de comercio electrónico desarrollada como proyecto evaluativo del Módulo 7 del Bootcamp Fullstack. Implementa un e-commerce completo de perfumería de lujo con catálogo de productos, carrito de compras, autenticación JWT, gestión de roles y pasarela de pago simulada.

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
- [Estructura del proyecto](#estructura-del-proyecto)
- [Funcionalidades implementadas](#funcionalidades-implementadas)
- [Endpoints de la API](#endpoints-de-la-api)
- [Consumo de la API](#consumo-de-la-api)
- [Autenticación y autorización](#autenticación-y-autorización)
- [Gestión de productos](#gestión-de-productos)
- [Gestión de usuarios](#gestión-de-usuarios)
- [Carrito de compras](#carrito-de-compras)
- [Pasarela de pago](#pasarela-de-pago)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Despliegue](#despliegue)
- [Criterios de evaluación](#criterios-de-evaluación)

---

## Demo

- **Frontend:** [perfumeria-elegance.netlify.app](https://perfumeria-elegance.netlify.app)
- **Backend API:** [proyecto6-backend-auth-api-perfumeria.onrender.com](https://proyecto6-backend-auth-api-perfumeria.onrender.com)
- **Documentación Swagger:** [/api-docs](https://proyecto6-backend-auth-api-perfumeria.onrender.com/api-docs)

> Para probar el flujo de pago, use la tarjeta de prueba: `4242 4242 4242 4242` con cualquier fecha futura y CVV.

---

## Rutas de la aplicación

### Rutas públicas — accesibles sin iniciar sesión

| Ruta | Página | Descripción |
|---|---|---|
| `/` | Home | Página de inicio con hero y destacados |
| `/productos` | Catálogo | Listado de perfumes con filtros |
| `/productos/:id` | Detalle | Vista individual de un perfume |
| `/login` | Login | Formulario de inicio de sesión |
| `/register` | Registro | Formulario de registro con selector de rol |
| `/forgot-password` | Recuperar contraseña | Solicitud de reset por email |
| `/reset-password` | Restablecer contraseña | Nueva contraseña con token |

### Rutas privadas — requieren estar autenticado

| Ruta | Página | Descripción |
|---|---|---|
| `/carrito` | Carrito | Resumen del carrito de compras |
| `/checkout` | Checkout | Flujo de compra en 3 pasos |
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

Perfumería Elegance es una tienda en línea de alta perfumería con estética *luxury* desarrollada completamente con el stack MERN. El proyecto abarca desde la experiencia de usuario como visitante anónimo (carrito de invitado) hasta el flujo completo de compra autenticada, administración de productos y gestión de roles de usuario.

### Objetivos de aprendizaje aplicados

- Manejo de rutas en el cliente con React Router v6, incluyendo rutas públicas, protegidas y de administrador.
- Manejo de estado global con Context API (`AuthContext`) y Zustand (`useCartStore`).
- Comunicación cliente-servidor mediante Axios con interceptores de autenticación.
- Implementación de autenticación y autorización con JWT en el frontend.
- Gestión de roles (`user` / `admin`) para control de acceso a áreas privadas.
- CRUD completo de productos desde un panel de administración.
- Gestión de usuarios y roles desde panel de administración con endpoints protegidos por rol.
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
| React Hook Form + useWatch | Manejo y validación de formularios |
| Tailwind CSS v4 | Estilos utilitarios |
| CSS Variables | Sistema de diseño luxury (tipografías, colores, sombras) |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express.js | Servidor y rutas API |
| MongoDB + Mongoose | Base de datos y modelos |
| JWT | Generación y validación de tokens |
| bcryptjs | Hash de contraseñas |
| express-validator | Validación de inputs en el servidor |
| cors | Política de origen cruzado |
| dotenv | Variables de entorno |
| Swagger UI + swagger-jsdoc | Documentación interactiva de la API |

---

## Estructura del proyecto

```
src/
├── api/
│   ├── axiosConfig.js        # Instancia Axios con interceptores JWT
│   ├── authService.js        # Login, register, verifyToken, updateProfile
│   ├── productService.js     # CRUD de perfumes
│   └── cartService.js        # Operaciones del carrito
├── context/
│   └── AuthContext.jsx       # Estado global de autenticación
├── store/
│   └── useCartStore.js       # Estado global del carrito (Zustand)
├── routes/
│   ├── AppRoutes.jsx         # Definición de todas las rutas
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
│   ├── common/               # Input, PasswordInput (con medidor), Button, Card
│   ├── layout/               # MainLayout, Navbar
│   └── products/             # ProductCard, ProductFilters
└── utils/
    ├── constants.js          # Constantes globales, STORAGE_KEYS, ROUTES
    └── formatters.js         # formatPrice, formatDate
```

---

## Funcionalidades implementadas

### Usuarios / Autenticación
- Registro de cuenta nueva con validación de formulario
- **Selector de rol (Cliente / Administrador) en el registro** — habilitado para entorno de prueba
- Inicio de sesión con JWT persistido en `localStorage`
- Verificación de token al cargar la aplicación (`verifyToken`)
- Cierre de sesión con limpieza de estado y almacenamiento local
- Perfil de usuario editable (nombre, email)
- Protección de rutas por autenticación (`PrivateRoute`) y por rol (`AdminRoute`)
- Indicador de fortaleza de contraseña en formularios de registro
- Toggle ver/ocultar contraseña en todos los campos de tipo password
- Páginas de recuperación de contraseña preparadas para conectar al backend

### Gestión de roles
- Roles `user` y `admin` persistidos en MongoDB
- Middleware `isAdmin` en el backend protege los endpoints de administración
- Panel de administración de usuarios para promover/degradar roles en tiempo real
- `AdminRoute` bloquea el acceso a `/admin/*` para usuarios sin rol admin

### Catálogo de productos
- Listado de todos los perfumes consumido desde el backend
- Filtros por categoría (Hombre / Mujer / Unisex), precio mínimo, precio máximo y búsqueda por nombre con debounce de 300ms
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
- Dashboard con estadísticas del inventario (total productos, en stock, stock bajo, valor inventario)
- CRUD completo de perfumes con previsualización de imagen en tiempo real
- Confirmación antes de eliminar productos con modal de seguridad
- **Gestión de usuarios:** tabla con búsqueda, filtro por rol y botones de promover/degradar con modal de confirmación

---

## Endpoints de la API

Base URL: `https://proyecto6-backend-auth-api-perfumeria.onrender.com/api`

### Usuarios — `/users`

| Método | Endpoint | Descripción | Auth | Rol |
|---|---|---|---|---|
| `POST` | `/users/register` | Registrar nuevo usuario | No | — |
| `POST` | `/users/login` | Iniciar sesión | No | — |
| `GET` | `/users/verifytoken` | Verificar y renovar JWT | Sí | — |
| `GET` | `/users/getme` | Datos del usuario autenticado | Sí | — |
| `PUT` | `/users/update` | Actualizar perfil propio | Sí | — |
| `DELETE` | `/users/deleteme` | Desactivar cuenta (borrado lógico) | Sí | — |
| `GET` | `/users/readall` | Listar todos los usuarios | Sí | admin |
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

### Estructura de respuesta del backend

Todos los endpoints siguen una estructura consistente con dos niveles de anidamiento:

```json
{
  "success": true,
  "message": "Descripción de la operación",
  "data": {
    // Datos de la respuesta
  }
}
```

Ejemplo — respuesta de login:
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "699b36b2586b5dd952e0639c",
      "name": "Salem Hidd",
      "email": "salemhidd1994@gmail.com",
      "role": "admin",
      "createdAt": "2026-02-22T22:05:15.226Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Ejemplo — respuesta de `GET /users/readall`:
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": {
    "users": [
      { "id": "...", "name": "Salem Hidd", "email": "...", "role": "admin" },
      { "id": "...", "name": "Usuario Test", "email": "...", "role": "user" }
    ]
  }
}
```

---

## Consumo de la API

### Configuración de Axios

Instancia centralizada con interceptores para adjuntar el JWT automáticamente y manejar errores globales:

```js
// src/api/axiosConfig.js
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de request — adjunta el token en cada petición
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de response — redirige al login si el token expira
axiosInstance.interceptors.response.use(
  (response) => response, // devuelve response completo — los servicios leen response.data.data
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data?.message || 'Error en la petición');
  }
);
```

### Lectura de respuestas anidadas

El backend devuelve `{ success, message, data: { ... } }`. Axios devuelve `response` completo, por lo que los datos reales siempre están en `response.data.data`:

```js
// GET /perfumes/readall → { success, data: { perfumes: [...] } }
const response = await productService.getAllProducts();
const perfumes = response.data.data.perfumes;

// GET /users/readall → { success, data: { users: [...] } }
const response = await axiosInstance.get('/users/readall');
const users = response.data.data.users;

// GET /cart → { success, data: { items, totalItems, totalPrice } }
const response = await cartService.getCart();
const cartData = response.data.data;
```

---

## Autenticación y autorización

### Flujo de autenticación

```
1. Usuario completa formulario de login/registro (con selector de rol opcional)
2. Frontend envía credenciales al backend
3. Backend valida, genera JWT y responde con { user, token }
4. Frontend guarda token y user en localStorage
5. AuthContext actualiza el estado global (isAuthenticated, user, isAdmin)
6. Cada petición subsiguiente incluye el token en el header Authorization
7. Al recargar la app, verifyToken confirma que el token sigue siendo válido
```

### Middlewares de protección en el backend

```js
// authMiddleware.js

// Verifica el JWT y adjunta req.user
export const authenticateToken = async (req, res, next) => { ... };

// Verifica que req.user.role === 'admin' — debe usarse después de authenticateToken
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Acceso denegado — se requiere rol administrador' });
  }
  next();
};
```

### AuthContext

```jsx
// Disponible en toda la app mediante useAuth()
const { user, isAuthenticated, isAdmin, login, logout, register, updateUser } = useAuth();
```

### Protección de rutas en el frontend

```jsx
// PrivateRoute — requiere estar autenticado
<Route element={<PrivateRoute />}>
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/perfil" element={<Profile />} />
  <Route path="/carrito" element={<Cart />} />
</Route>

// AdminRoute — requiere rol admin
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminPanel />} />
  <Route path="/admin/productos" element={<AdminProducts />} />
  <Route path="/admin/productos/crear" element={<AdminCreateProduct />} />
  <Route path="/admin/productos/editar/:id" element={<AdminCreateProduct />} />
  <Route path="/admin/usuarios" element={<AdminUsers />} />
</Route>
```

---

## Gestión de productos

El panel de administración implementa CRUD completo accesible en `/admin/productos`:

- **Crear** (`/admin/productos/crear`): formulario con validación, previsualización de imagen en tiempo real y precio formateado en CLP.
- **Leer** (`/admin/productos`): tabla con búsqueda por nombre, filtro por estado de stock y estadísticas del inventario en el dashboard.
- **Actualizar** (`/admin/productos/editar/:id`): mismo formulario de creación reutilizado, precargado con los datos existentes del producto.
- **Eliminar**: modal de confirmación con nombre del producto para evitar borrados accidentales. Toast de feedback tras la operación.

---

## Gestión de usuarios

Accesible en `/admin/usuarios`, exclusivo para administradores.

- Tabla con todos los usuarios activos del sistema
- Búsqueda por nombre o email en tiempo real
- Filtro por rol (Todos / Admin / Cliente)
- Stats cards: total usuarios, admins, clientes
- Botón **Hacer admin** / **Quitar admin** con modal de confirmación antes de ejecutar el cambio
- El cambio de rol llama a `PUT /users/update/:id` con `{ role }` y se refleja inmediatamente en la tabla

```
Flujo de cambio de rol:
Admin selecciona usuario → confirma en modal
→ PUT /api/users/update/:id { role: 'admin' | 'user' }
→ Backend actualiza en MongoDB y devuelve user actualizado
→ Frontend actualiza la tabla sin recargar la página
```

---

## Carrito de compras

### Carrito dual (invitado / autenticado)

```
Usuario invitado:
  └── addItem() → guarda en localStorage (STORAGE_KEYS.GUEST_CART)

Usuario autenticado:
  └── addItem() → POST /cart/add → fetchCartFromBackend()

Al hacer login:
  └── migrateGuestCart()
        → copia ítems del guest cart
        → marca isGuest = false
        → POST /cart/add por cada ítem
        → limpia localStorage
        → GET /cart (estado final del backend)
```

### Estado del carrito con Zustand

```js
const { items, totalItems, totalPrice, addItem, removeItem, updateItemQuantity, clearCart } = useCartStore();
```

---

## Pasarela de pago

Se implementó un flujo de checkout de 3 pasos con UI que simula Stripe:

1. **Envío:** formulario con nombre, email, teléfono, dirección, ciudad, región y código postal con validación completa.
2. **Pago:** inputs con formateo automático (número de tarjeta en grupos de 4, expiración MM/AA, CVV). Tarjeta de prueba: `4242 4242 4242 4242`.
3. **Confirmación:** número de orden generado, resumen del pedido y limpieza del carrito.

> La integración real con Stripe está preparada para implementarse en el backend — el frontend ya tiene la estructura del flujo completa.

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
- Archivo `_redirects` en `/public` (necesario para React Router en Netlify):
  ```
  /* /index.html 200
  ```

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

**Gestión de productos (30%):** CRUD completo desde panel de administración protegido por rol. Catálogo público con filtros por categoría, precio y búsqueda. Vista de detalle individual. Badges de stock en tiempo real. Dashboard con métricas del inventario.

**Autenticación (30%):** Registro y login con JWT. Selector de rol en el registro (entorno de prueba). Verificación de token al cargar la aplicación. Rutas privadas con `PrivateRoute` y `AdminRoute`. Middleware `isAdmin` en el backend. Gestión de usuarios y roles desde panel dedicado. Perfil editable. Indicador de fortaleza de contraseña y toggle ver/ocultar.

**Pasarela de pagos (20%):** Flujo de checkout de 3 pasos (envío, pago, confirmación). UI de Stripe con formateo automático de inputs. Carrito con cálculo de subtotal, envío y total. Migración automática del carrito invitado al autenticarse.

**Despliegue (20%):** Frontend en Netlify con variables de entorno configuradas. Backend en Render. Base de datos en MongoDB Atlas. Documentación Swagger disponible en producción.

---

## Autor

**Salem Hidd**
Bootcamp Fullstack — Módulo 7
