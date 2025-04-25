# Tienda Móviles

Aplicación web para compra de dispositivos móviles, desarrollada con React y TypeScript.

## 🚀 Tecnologías

- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) - Herramienta de construcción
- [React Router 6](https://reactrouter.com/) - Enrutamiento
- [Zustand](https://github.com/pmndrs/zustand) - Gestión de estado
- [React Query](https://tanstack.com/query/latest) - Gestión de peticiones y caché
- [Axios](https://axios-http.com/) - Cliente HTTP
- [Vitest](https://vitest.dev/) - Framework de testing

## ✨ Características

- Listado de productos con filtro en tiempo real
- Página de detalles del producto
- Añadir productos al carrito
- Caché de datos con caducidad de 1 hora
- Diseño responsive
- Navegación sin recargar página (SPA)
- Testing unitario y de integración

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
  Inicia el servidor de desarrollo en [http://localhost:5173](http://localhost:5173)

- **Desarrollo (alternativo)**
  ```bash
  npm run dev
  ```
  Alias para iniciar el servidor de desarrollo

- **Compilación**
  ```bash
  npm run build
  ```
  Genera una versión optimizada para producción

- **Previsualización**
  ```bash
  npm run preview
  ```
  Previsualiza la versión compilada

- **Pruebas**
  ```bash
  npm test
  ```
  Ejecuta las pruebas automatizadas

- **Pruebas con cobertura**
  ```bash
  npm run test:coverage
  ```
  Ejecuta las pruebas y genera informe de cobertura

- **Pruebas en modo watch**
  ```bash
  npm run test:watch
  ```
  Ejecuta las pruebas en modo observador

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
├── types/           # Definiciones de tipos TypeScript
├── utils/           # Funciones de utilidad
└── __tests__/       # Tests de la aplicación
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

### Testing
- Pruebas unitarias y de integración con Vitest y Testing Library
- Mocking de peticiones HTTP con MSW (Mock Service Worker)
- Generación de informes de cobertura de código

### Principios de Desarrollo
- Aplicación de principios SOLID y Clean Code
- Componentes con responsabilidad única
- Separación clara de lógica de negocio y presentación
- Estructura de proyecto organizada y escalable

## 🛡️ Requisitos del Sistema

- Node.js 16+
- npm 7+

## 👥 Colaboración

Para contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Sube los cambios a tu fork (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles. 