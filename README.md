# Tienda Móviles

Aplicación web para compra de dispositivos móviles, desarrollada con React.

## 🚀 Tecnologías

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand) - Gestión de estado
- [React Query](https://react-query.tanstack.com/) - Gestión de peticiones y caché

## ✨ Características

- Listado de productos con filtro en tiempo real
- Página de detalles del producto
- Añadir productos al carrito
- Caché de datos con caducidad de 1 hora
- Diseño responsive
- Navegación sin recargar página (SPA)

## 🛠️ Instalación

Clona el repositorio:

```bash
git clone https://github.com/robertluiz/tienda-moviles.git
cd tienda-moviles
```

Instala las dependencias:

```bash
npm install
```

## 📋 Scripts

- **Desarrollo**
  ```bash
  npm start
  ```
  Inicia el servidor de desarrollo en [http://localhost:3000](http://localhost:3000)

- **Compilación**
  ```bash
  npm run build
  ```
  Genera una versión optimizada para producción

- **Pruebas**
  ```bash
  npm test
  ```
  Ejecuta las pruebas automatizadas

- **Lint**
  ```bash
  npm run lint
  ```
  Verifica problemas de código y estilo

## 📱 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── hooks/           # Hooks personalizados
├── pages/           # Páginas de la aplicación
├── services/        # Servicios de API
├── store/           # Gestión de estado (Zustand)
├── styles/          # Estilos globales
└── utils/           # Funciones de utilidad
```

## 🔍 API

La aplicación consume datos de la API:

- Listado de productos: `GET /api/product`
- Detalles del producto: `GET /api/product/:id`
- Añadir al carrito: `POST /api/cart`

URL base: `https://itx-frontend-test.onrender.com/`

## 📝 Implementación

### Gestión de Estado
- Utilizamos Zustand para gestionar el estado global de la aplicación de forma sencilla y eficiente
- React Query para gestionar peticiones a la API, incluyendo caché e invalidación

### Caché
- Hemos implementado un sistema de caché con caducidad de 1 hora para mejorar el rendimiento
- Los datos se almacenan localmente para reducir las peticiones a la API

### Requisitos Cumplidos
- SPA con navegación del lado del cliente
- Scripts para desarrollo, compilación, pruebas y lint
- Diseño responsive adaptado para diferentes tamaños de pantalla
- Filtro de productos en tiempo real 