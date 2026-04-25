# API v2 - Productos Microservice

## Overview

Esta documentación describe la API v2 del microservicio de productos, implementada con arquitectura SOLID, persistencia en Supabase y validaciones robustas.

## Base URL

**Producción:**
```
https://microservice-backend-products-v2.vercel.app/api/v2
```

**Desarrollo Local:**
```
http://localhost:10102/api/v2
```

## Documentación Interactiva

Accede a la documentación interactiva generada con Scalar:
```
https://microservice-backend-products-v2.vercel.app/api-docs
```

## Autenticación

Todos los endpoints de escritura (POST, PUT, DELETE) requieren autenticación mediante token JWT en el header:

```
Authorization: Bearer <token>
```

Los endpoints GET de consulta son públicos y no requieren autenticación.

## Permisos

El sistema utiliza un modelo de permisos simplificado:
- **ADMINISTRADOR**: Rol requerido para todas las operaciones de escritura
- **Público**: Lectura de productos, categorías, stock e imágenes sin autenticación

## Endpoints Públicos (Sin Autenticación)

- `GET /api/v2/products` - Lista de productos
- `GET /api/v2/products/{id}` - Producto específico
- `GET /api/v2/categories` - Lista de categorías  
- `GET /api/v2/categories/{id}` - Categoría específica
- `GET /api/v2/images/{id}` - Información de imagen
- `GET /api/v2/stock/{productId}` - Stock de producto
- `GET /api/v2/stock/history` - Historial de movimientos de stock

## Endpoints Protegidos (Requieren ADMINISTRADOR)

- `POST /api/v2/products` - Crear producto
- `PUT /api/v2/products/{id}` - Actualizar producto
- `DELETE /api/v2/products/{id}` - Eliminar producto
- `POST /api/v2/categories` - Crear categoría
- `PUT /api/v2/categories/{id}` - Actualizar categoría
- `DELETE /api/v2/categories/{id}` - Eliminar categoría
- `POST /api/v2/images/upload` - Subir imagen
- `DELETE /api/v2/images/{id}` - Eliminar imagen
- `POST /api/v2/stock/{productId}` - Registrar ingreso de stock
- `GET /api/v2/reports/low-stock` - Reporte de stock bajo

## Endpoints

### Productos

#### GET /products
Obtener lista de productos con paginación, filtros y ordenamiento.

**Query Parameters:**
- `page` (number, optional): Número de página (default: 1)
- `limit` (number, optional): Límite de resultados por página (default: 20, max: 100)
- `id_categoria` (number, optional): Filtrar por categoría
- `precio_min` (number, optional): Precio mínimo
- `precio_max` (number, optional): Precio máximo
- `nombre` (string, optional): Filtrar por nombre (búsqueda parcial)
- `sort` (string, optional): Campo de ordenamiento (default: nombre_producto)
- `order` (string, optional): Dirección ASC|DESC (default: ASC)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id_producto": 1,
        "nombre_producto": "Producto Ejemplo",
        "precio": 99.99,
        "descripcion": "Descripción del producto",
        "cantidad_ingreso": 100,
        "id_categoria": 1,
        "activo": true,
        "imagenes": [
          {
            "id": 1,
            "product_id": 1,
            "image_url": "https://storage.example.com/images/producto_1.jpg",
            "storage_path": "productos/producto_1.jpg",
            "is_primary": true,
            "created_at": "2025-04-25T10:30:00Z"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### GET /products/{id}
Obtener un producto específico con sus imágenes.

**Path Parameters:**
- `id` (number, required): ID del producto

**Response:**
```json
{
  "success": true,
  "data": {
    "id_producto": 1,
    "nombre_producto": "Producto Ejemplo",
    "precio": 99.99,
    "descripcion": "Descripción del producto",
    "cantidad_ingreso": 100,
    "id_categoria": 1,
    "activo": true,
    "imagenes": [
      {
        "id": 1,
        "product_id": 1,
        "image_url": "https://storage.example.com/images/producto_1.jpg",
        "storage_path": "productos/producto_1.jpg",
        "is_primary": true,
        "created_at": "2025-04-25T10:30:00Z"
      }
    ]
  }
}
```

#### POST /products
Crear un nuevo producto con imágenes opcionales.

**Headers:**
- `Content-Type: multipart/form-data`

**Body (form-data):**
- `nombre_producto` (string, required): Nombre del producto (2-120 caracteres)
- `precio` (number, required): Precio (≥ 0)
- `descripcion` (string, optional): Descripción (max 255 caracteres)
- `cantidad_ingreso` (number, optional): Cantidad inicial (≥ 0)
- `id_categoria` (number, optional): ID categoría (≥ 1)
- `images` (file[], optional): Array de imágenes (max 5MB por imagen)
- `primary_image_index` (number, optional): Índice de imagen principal

**Response:**
```json
{
  "success": true,
  "message": "Producto registrado con éxito",
  "data": {
    "product_id": 123,
    "images": [
      {
        "id": 456,
        "product_id": 123,
        "image_url": "https://storage.example.com/images/producto_123.jpg",
        "storage_path": "productos/producto_123.jpg",
        "is_primary": true,
        "created_at": "2025-04-25T10:30:00Z"
      }
    ]
  }
}
```

#### PUT /products/{id}
Actualizar un producto existente.

**Path Parameters:**
- `id` (number, required): ID del producto

**Headers:**
- `Content-Type: multipart/form-data`

**Body (form-data):**
- `nombre_producto` (string, optional): Nombre del producto (2-120 caracteres)
- `precio` (number, optional): Precio (≥ 0)
- `descripcion` (string, optional): Descripción (max 255 caracteres)
- `id_categoria` (number, optional): ID categoría (≥ 1)
- `images` (file[], optional): Array de imágenes nuevas
- `delete_images` (string[], optional): IDs de imágenes a eliminar
- `primary_image_index` (number, optional): Índice de imagen principal

**Response:**
```json
{
  "success": true,
  "message": "Producto actualizado con éxito",
  "data": {
    "product_id": 123,
    "images": {
      "uploaded": [...],
      "deleted": ["789"],
      "errors": []
    }
  }
}
```

#### DELETE /products/{id}
Eliminar un producto.

**Path Parameters:**
- `id` (number, required): ID del producto

**Response:**
```json
{
  "success": true,
  "message": "Producto eliminado con éxito"
}
```

### Stock

#### POST /stock/{productId}
Registrar un nuevo ingreso de stock para un producto. Actualiza automáticamente el precio del producto basado en el costo unitario y porcentaje de venta.

**Path Parameters:**
- `productId` (number, required): ID del producto

**Headers:**
- `Authorization: Bearer <token>` (requerido)
- `Content-Type: application/json`

**Body:**
```json
{
  "cantidad_ingresada": 10,
  "codigo_factura": "FAC-001-2025",
  "costo_total": 5000.00,
  "costo_unitario": 500.00,
  "porcentaje_venta": 30,
  "id_usuario": 1,
  "fecha_vencimiento": "2025-12-31"
}
```

**Response:**
```json
{
  "message": "Stock registrado con éxito"
}
```

#### GET /stock/{productId}
Obtener información de stock de un producto específico.

**Path Parameters:**
- `productId` (number, required): ID del producto

**Response:**
```json
{
  "id_registro": 1,
  "id_producto": 1,
  "cantidad_ingresada": 10,
  "codigo_factura": "FAC-001-2025",
  "costo_total": 5000.00,
  "costo_unitario": 500.00,
  "porcentaje_venta": 30,
  "fecha_ingreso": "2025-04-25T10:30:00Z",
  "id_usuario": 1,
  "nombre_producto": "Laptop Gaming"
}
```

#### GET /stock/history
Obtener historial de ingresos de stock.

**Query Parameters:**
- `page` (number, optional): Página (default: 1)
- `limit` (number, optional): Límite (default: 10, max: 100)
- `product_id` (number, optional): Filtrar por producto

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_registro": 1,
      "id_producto": 1,
      "cantidad_ingresada": 10,
      "codigo_factura": "FAC-001-2025",
      "costo_total": 5000.00,
      "costo_unitario": 500.00,
      "porcentaje_venta": 30,
      "fecha_ingreso": "2025-04-25T10:30:00Z",
      "id_usuario": 1,
      "nombre_producto": "Laptop Gaming"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Reportes

#### GET /reports/low-stock
Obtener productos con stock bajo (menor al umbral especificado).

**Headers:**
- `Authorization: Bearer <token>` (requerido)

**Query Parameters:**
- `umbral` (number, optional): Umbral de stock (default: 15)

**Response:**
```json
[
  {
    "id_producto": 1,
    "nombre_producto": "Producto con stock bajo",
    "precio": 99.99,
    "cantidad_ingreso": 10,
    "id_categoria": 1
  }
]
```

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Error de validación |
| 401 | No autorizado |
| 403 | Permisos insuficientes |
| 404 | Recurso no encontrado |
| 409 | Conflicto de datos |
| 422 | Error de validación detallado |
| 500 | Error interno del servidor |

## Códigos de Error Supabase

La API utiliza Supabase como capa de persistencia. Los siguientes códigos de error pueden aparecer en las respuestas:

| Código | Descripción | HTTP Status |
|--------|-------------|-------------|
| `PGRST116` | Recurso no encontrado | 404 |
| `23505` | Violación de constraint único (duplicado) | 409 |
| `23503` | Violación de foreign key | 400 |
| `22P02` | Tipo de dato inválido | 400 |

**Nota**: El código `PGRST116` se retorna cuando se usa `.single()` en Supabase y no se encuentra el registro.

## Errores

### Formato de Error de Validación (422)
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "nombre_producto",
      "message": "El nombre del producto debe tener entre 2 y 120 caracteres",
      "value": "A"
    }
  ]
}
```

### Formato de Error General
```json
{
  "success": false,
  "message": "Mensaje de error",
  "error": "Código de error",
  "details": "Detalles adicionales (en desarrollo)"
}
```

## Caché

La API implementa caché inteligente para respuestas GET:

- **TTL**: 5 minutos por defecto
- **Headers**: `X-Cache: HIT|MISS` indica si la respuesta viene de caché
- **Invalidación**: El caché se invalida automáticamente en operaciones de escritura

## Rate Limiting

- **Límite**: 100 solicitudes por minuto por usuario
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Ejemplos de Uso

### JavaScript (Fetch)
```javascript
// Obtener productos con filtros
const response = await fetch('/api/v2/products?page=1&limit=10&id_categoria=1', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

const data = await response.json();
console.log(data.products);
```

### cURL
```bash
# Crear producto
curl -X POST https://api.example.com/api/v2/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "nombre_producto=Mi Producto" \
  -F "precio=99.99" \
  -F "descripcion=Descripción" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

## Consideraciones de Rendimiento

1. **Paginación**: Use límites razonables (≤ 100) para mejor rendimiento
2. **Filtros**: Combine múltiples filtros para reducir resultados
3. **Caché**: Las respuestas GET se cachéan automáticamente
4. **Imágenes**: Use compresión y formatos optimizados (WebP)
5. **Concurrencia**: Evite múltiples solicitudes simultáneas del mismo recurso

## Cambios Recientes

### Abril 2025 - Migración a Supabase
- ✅ **Migración completa a Supabase**: Todos los repositorios ahora usan el cliente oficial de Supabase
- ✅ **Unificación de documentación**: Consolidación de swagger.yaml como fuente única de verdad
- ✅ **Actualización de DTOs**: Campos de imagen actualizados (`is_primary`, `storage_path`, `image_url`)
- ✅ **Documentación Scalar mejorada**: Configuración con branding, dark mode y metadatos
- ✅ **Endpoints de stock documentados**: Registro de ingresos con cálculo automático de precios
- ✅ **Endpoint de reportes**: `/reports/low-stock` para productos con stock bajo

### Features Estables
- ✅ DTOs estandarizados con interfaces TypeScript puras
- ✅ Validaciones centralizadas y robustas
- ✅ Manejo de errores unificado (códigos Supabase)
- ✅ Arquitectura SOLID con patrón Repository
- ✅ Autenticación JWT con roles (ADMINISTRADOR)
- ✅ Upload de imágenes a Supabase Storage

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│  Routes → Controllers → Middleware (Auth/Validation)        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
│  ProductService → ProductImageService → CategoriaService      │
│  StockService → ReportService → ImageService                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Repository Layer                           │
│  ProductRepository → CategoriaRepository → StockRepository  │
│  ProductImageRepository → ReportsRepository                 │
│                    (Supabase Client)                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Platform                          │
│  PostgreSQL Database + Storage + Auth                        │
└─────────────────────────────────────────────────────────────┘
```

## Soporte

Para soporte técnico o reporte de issues:
- Email: support@example.com
- Documentation: https://docs.example.com
- Status: https://status.example.com
