# API v2 - Productos Microservice

## Overview

Esta documentación describe la API v2 optimizada del microservicio de productos, implementada con arquitectura SOLID, caché inteligente y validaciones robustas.

## Base URL

```
https://api.example.com/api/v2
```

## Autenticación

Todos los endpoints (excepto GET públicos) requieren autenticación mediante token JWT en el header:

```
Authorization: Bearer <token>
```

## Permisos

Se requieren permisos específicos según la operación:
- **LECTURA**: Para operaciones GET
- **ESCRITURA**: Para operaciones POST, PUT, DELETE
- **ADMINISTRADOR**: Para todas las operaciones

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
        "id": 1,
        "nombre_producto": "Producto Ejemplo",
        "precio": 99.99,
        "descripcion": "Descripción del producto",
        "cantidad_ingreso": 100,
        "id_categoria": 1,
        "activo": true,
        "imagenes": [
          {
            "id": 1,
            "url_imagen": "https://example.com/image.jpg",
            "es_principal": true
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
    "id": 1,
    "nombre_producto": "Producto Ejemplo",
    "precio": 99.99,
    "descripcion": "Descripción del producto",
    "cantidad_ingreso": 100,
    "id_categoria": 1,
    "activo": true,
    "imagenes": [
      {
        "id": 1,
        "url_imagen": "https://example.com/image.jpg",
        "es_principal": true
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
        "url_imagen": "https://storage.example.com/products/image.jpg",
        "es_principal": true
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

## Cambios Recientes (v2)

- ✅ DTOs estandarizados con interfaces TypeScript puras
- ✅ Validaciones centralizadas y robustas
- ✅ Manejo de errores unificado
- ✅ Caché inteligente con invalidación automática
- ✅ Paginación y filtrado eficiente
- ✅ Arquitectura SOLID con patrón Strategy
- ✅ Optimización de consultas a base de datos
- ✅ Separación de responsabilidades clara

## Soporte

Para soporte técnico o reporte de issues:
- Email: support@example.com
- Documentation: https://docs.example.com
- Status: https://status.example.com
