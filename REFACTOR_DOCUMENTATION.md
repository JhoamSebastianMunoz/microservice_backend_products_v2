# Documentación de Refactorización - Microservicio de Productos

## Resumen de Cambios

Se ha completado la refactorización del microservicio de productos para soportar **múltiples imágenes por producto** utilizando Supabase Storage.

## 🔄 Cambios Realizados

### 1. Base de Datos
- **Nueva tabla**: `product_images` con relación 1:N a productos
- **Esquema limpio**: Base de datos recreada desde cero (sin migración necesaria)
- **Eliminación**: Columna `id_imagen` removida de tabla `productos`

### 2. Nuevo Sistema de Imágenes
- **DTOs**: `ProductImageDto`, `CreateProductWithImagesDto`
- **Repository**: `ProductImageRepository` con operaciones CRUD
- **Service**: `ProductImageService` con lógica de negocio
- **Middleware**: `registerMultipleImagesValidator` para múltiples archivos

### 3. Actualización de Controladores
- **register-product**: Ahora acepta múltiples imágenes
- **update-product**: Permite agregar/eliminar imágenes
- **Nuevas rutas**: Gestión específica de imágenes

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
```
Dto/productDto/
  ProductImageDto.ts
  CreateProductWithImagesDto.ts

repositories/
  ProductImageRepository.ts

services/
  ProductImageService.ts

middleware/imageMiddleware/
  registerMultipleImagesValidator.ts

routes/productRoutes/
  product_images.ts
```

### Archivos Modificados:
```
Dto/productDto/ProductDto.ts (eliminado id_imagen)
Dto/productDto/UpdateProductDto.ts (eliminado id_imagen)
controllers/productController/register-product-controller.ts
controllers/productController/update-product-controller.ts
repositories/ProductRepository.ts (eliminado id_imagen)
routes/productRoutes/register_product.ts
routes/productRoutes/update_product.ts
app.ts (nuevas rutas de imágenes)
```

## 🚀 Ejecución de la Migración

### Paso 1: Ejecutar Scripts SQL
```sql
-- Ejecutar en orden:
1. migrations/001_create_product_images_table.sql
2. migrations/002_migrate_existing_images.sql
3. migrations/003_remove_id_imagen_from_products.sql
```

### Paso 2: Variables de Entorno
Asegúrate de tener configuradas:
```env
SUPABASE_URL=tu_url_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_key
SUPABASE_STORAGE_BUCKET=productos
```

## 📡 Nuevos Endpoints

### Gestión de Imágenes
```
GET    /products/:product_id/images              - Obtener todas las imágenes
GET    /products/:product_id/images/primary     - Obtener imagen principal
PUT    /products/:product_id/images/:image_id/set-primary - Establecer imagen principal
DELETE /products/:product_id/images/:image_id   - Eliminar imagen específica
DELETE /products/:product_id/images            - Eliminar todas las imágenes
```

### Productos (Actualizados)
```
POST   /register-product                        - Crear producto con múltiples imágenes
PUT    /update-product/:id_producto              - Actualizar producto e imágenes
```

## 🔧 Uso de la API

### Crear Producto con Múltiples Imágenes
```javascript
const formData = new FormData();
formData.append('nombre_producto', 'Producto Test');
formData.append('precio', '99.99');
formData.append('descripcion', 'Descripción del producto');
formData.append('id_categoria', '1');
formData.append('primary_image_index', '0'); // Opcional: imagen principal

// Agregar múltiples imágenes
formData.append('images', file1);
formData.append('images', file2);
formData.append('images', file3);

fetch('/register-product', {
    method: 'POST',
    body: formData,
    headers: {
        'Authorization': 'Bearer token',
        'Content-Type': 'multipart/form-data'
    }
});
```

### Actualizar Producto con Imágenes
```javascript
const formData = new FormData();
formData.append('nombre_producto', 'Producto Actualizado');
formData.append('precio', '149.99');
formData.append('delete_images', JSON.stringify([1, 2])); // IDs a eliminar
formData.append('primary_image_index', '0'); // Nueva imagen principal

// Agregar nuevas imágenes
formData.append('images', newFile1);
formData.append('images', newFile2);

fetch(`/update-product/${productId}`, {
    method: 'PUT',
    body: formData,
    headers: {
        'Authorization': 'Bearer token',
        'Content-Type': 'multipart/form-data'
    }
});
```

## 🎯 Características Implementadas

### ✅ Múltiples Imágenes por Producto
- Hasta 5 imágenes por producto
- Validación de tipos: JPEG, PNG, GIF, WebP
- Tamaño máximo: 6MB por archivo

### ✅ Gestión de Imagen Principal
- Marcar imagen como principal
- Consulta rápida de imagen principal
- Migración automática de imágenes existentes

### ✅ Operaciones CRUD Completas
- Crear, leer, actualizar, eliminar imágenes
- Eliminación en cascada al eliminar producto
- Transacciones atómicas para consistencia

### ✅ Manejo de Errores
- Validación detallada de archivos
- Mensajes de error específicos
- Logging completo para debugging

### ✅ Seguridad
- Middleware de autenticación y autorización
- Validación de tipos de archivo
- Control de tamaño de archivos

## 🔍 Consideraciones Técnicas

### Performance
- Índices en `product_id` para consultas rápidas
- Índice único en `storage_path` para evitar duplicados
- Lazy loading de imágenes en endpoints de listado

### Compatibilidad
- Rutas existentes mantienen compatibilidad
- Middleware original preservado para imágenes únicas
- Migración segura de datos existentes

### Escalabilidad
- Supabase Storage para almacenamiento escalable
- Estructura relacional optimizada
- Separación clara de responsabilidades

## 🚨 Notas Importantes

1. **Backup**: Realiza backup de la base de datos antes de la migración
2. **Orden**: Ejecuta los scripts SQL en el orden indicado
3. **Testing**: Prueba los endpoints con diferentes escenarios
4. **Monitoreo**: Revisa los logs para detectar problemas

## 🔄 Próximos Pasos Recomendados

1. **Testing Automatizado**: Crear tests unitarios y de integración
2. **Documentación API**: Actualizar Swagger con nuevos endpoints
3. **Caching**: Implementar caché para URLs de imágenes
4. **Optimización**: Comprimir imágenes automáticamente al subir
5. **CDN**: Configurar CDN para distribución de imágenes

---

**Refactorización completada exitosamente** 🎉

El microservicio ahora soporta múltiples imágenes por producto con una arquitectura escalable y mantenible.
