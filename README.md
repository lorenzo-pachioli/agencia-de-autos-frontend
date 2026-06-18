# Agencia Autos — API Tester Frontend

Frontend de testing manual para la API REST de una agencia de autos.

## Stack
- React 18 + TypeScript
- Vite + Tailwind CSS
- Axios (con interceptor dinámico de Bearer token)
- TanStack Query v5
- React Hook Form
- React Router v6
- Sonner (toasts)
- Lucide React (iconos)

## Instalación

```bash
npm install
npm run dev
```

## Configuración

Al abrir la app, ir a **Configuración** y definir:
- **Base URL** de la API (ej: `http://localhost:8080`)
- **JWT Token** (o hacer login desde el módulo Auth y se guarda automáticamente)

## Módulos disponibles

| Módulo | Endpoints |
|--------|-----------|
| Auth | POST /auth/login, POST /auth/register |
| Usuarios | GET/PUT/PATCH /usuarios, POST /usuarios/vendedores |
| Marcas | CRUD completo /marcas |
| Modelos | CRUD completo /modelos |
| Vehículos | CRUD + búsqueda avanzada + reportes + cambio estado |
| Imágenes | CRUD + filtro por vehículo + preview |
| Favoritos | GET/POST/DELETE /favoritos |
| Transacciones | CRUD + filtros + señar/vender/cancelar/comisión/rendimiento |
| Auditoría | Filtros avanzados + por transacción/vendedor + cambios estado/precio |

## Build producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para servir con cualquier servidor estático.
