"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductRepository_1 = __importDefault(require("../repositories/ProductRepository"));
const cacheMiddleware_1 = require("../middleware/cacheMiddleware");
const config_supabaseStorage_1 = __importDefault(require("../config/config-supabaseStorage"));
class OptimizedProductService {
    // Obtener productos con paginación, filtros y ordenamiento
    static getProductsOptimized() {
        return __awaiter(this, arguments, void 0, function* (query = {}) {
            try {
                const { pagination = { page: 1, limit: this.DEFAULT_PAGE_SIZE }, filters = {}, sort = { field: 'nombre_producto', direction: 'ASC' } } = query;
                // Validar y normalizar paginación
                const limit = Math.min(pagination.limit, this.MAX_PAGE_SIZE);
                const page = Math.max(1, pagination.page);
                const offset = (page - 1) * limit;
                // Construir consulta optimizada
                const queryBuilder = this.buildOptimizedQuery(filters, sort, { limit, offset });
                // Ejecutar consulta con conteo en paralelo para mejor rendimiento
                const [productsResult, totalCountResult] = yield Promise.all([
                    config_supabaseStorage_1.default
                        .from('productos')
                        .select('*', { count: 'exact' })
                        .range(offset, offset + limit - 1)
                        .order(sort.field, { ascending: sort.direction === 'ASC' }),
                    config_supabaseStorage_1.default
                        .from('productos')
                        .select('*', { count: 'exact', head: true })
                ]);
                if (productsResult.error)
                    throw productsResult.error;
                if (totalCountResult.error)
                    throw totalCountResult.error;
                const products = productsResult.data || [];
                const totalCount = totalCountResult.count || 0;
                const totalPages = Math.ceil(totalCount / limit);
                return {
                    products,
                    pagination: {
                        page,
                        limit,
                        total: totalCount,
                        totalPages,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    }
                };
            }
            catch (error) {
                console.error('Error en getProductsOptimized:', error);
                throw error;
            }
        });
    }
    // Obtener producto con sus relaciones precargadas
    static getProductWithRelations(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Consulta optimizada con JOIN para obtener producto e imágenes en una sola consulta
                const { data: productData, error: productError } = yield config_supabaseStorage_1.default
                    .from('productos')
                    .select(`
                    *,
                    producto_imagenes(id_imagen),
                    imagenes(id_imagen, url_imagen, es_principal)
                `)
                    .eq('id_producto', id)
                    .single();
                if (productError)
                    throw productError;
                if (!productData)
                    return null;
                const results = [productData];
                if (results.length === 0) {
                    return null;
                }
                // Procesar resultados para estructurar datos correctamente
                const product = Object.assign(Object.assign({}, results[0]), { imagenes: ((_a = results[0].producto_imagenes) === null || _a === void 0 ? void 0 : _a.map((pi) => {
                        var _a, _b;
                        return ({
                            id: pi.id_imagen,
                            url_imagen: (_a = pi.imagenes) === null || _a === void 0 ? void 0 : _a.url_imagen,
                            es_principal: (_b = pi.imagenes) === null || _b === void 0 ? void 0 : _b.es_principal
                        });
                    })) || [] });
                // Eliminar propiedades duplicadas
                delete product.producto_imagenes;
                return product;
            }
            catch (error) {
                console.error('Error en getProductWithRelations:', error);
                throw error;
            }
        });
    }
    // Crear producto con validación optimizada
    static createProductOptimized(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validación de negocio optimizada
                yield this.validateBusinessRules(product);
                // Inserción con retorno de ID
                const result = yield ProductRepository_1.default.add(product);
                // Invalidar caché relacionada
                (0, cacheMiddleware_1.invalidateCache)('/api/v2/products');
                return result;
            }
            catch (error) {
                console.error('Error en createProductOptimized:', error);
                throw error;
            }
        });
    }
    // Actualizar producto con validación de cambios
    static updateProductOptimized(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener producto actual para comparar cambios
                const currentProductResult = yield ProductRepository_1.default.get({ id: product.id });
                if (!currentProductResult || currentProductResult.length === 0) {
                    throw new Error('Producto no encontrado');
                }
                const currentProduct = currentProductResult[0];
                // Validar solo campos que han cambiado
                const changes = this.detectChanges(currentProduct, product);
                if (Object.keys(changes).length === 0) {
                    return { affectedRows: 0, message: 'No hay cambios que aplicar' };
                }
                // Actualización optimizada solo de campos modificados
                const updateData = Object.assign({ id: product.id }, changes);
                const result = yield ProductRepository_1.default.update(updateData);
                // Invalidar caché
                (0, cacheMiddleware_1.invalidateCache)(`/api/v2/products/${product.id}`);
                (0, cacheMiddleware_1.invalidateCache)('/api/v2/products');
                return result;
            }
            catch (error) {
                console.error('Error en updateProductOptimized:', error);
                throw error;
            }
        });
    }
    // Eliminar producto con manejo de dependencias
    static deleteProductOptimized(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar dependencias antes de eliminar
                const hasDependencies = yield this.checkDependencies(request.id);
                if (hasDependencies) {
                    throw new Error('No se puede eliminar el producto debido a dependencias existentes');
                }
                // Eliminación en cascada optimizada
                const result = yield ProductRepository_1.default.delete({ id_producto: request.id });
                // Invalidar caché
                (0, cacheMiddleware_1.invalidateCache)(`/api/v2/products/${request.id}`);
                (0, cacheMiddleware_1.invalidateCache)('/api/v2/products');
                return result;
            }
            catch (error) {
                console.error('Error en deleteProductOptimized:', error);
                throw error;
            }
        });
    }
    // Métodos privados de optimización
    static buildOptimizedQuery(filters, sort, pagination) {
        let whereConditions = [];
        let params = [];
        // Construir condiciones WHERE optimizadas
        if (filters.id_categoria) {
            whereConditions.push('p.id_categoria = ?');
            params.push(filters.id_categoria);
        }
        if (filters.precio_min !== undefined) {
            whereConditions.push('p.precio >= ?');
            params.push(filters.precio_min);
        }
        if (filters.precio_max !== undefined) {
            whereConditions.push('p.precio <= ?');
            params.push(filters.precio_max);
        }
        if (filters.nombre) {
            whereConditions.push('p.nombre_producto LIKE ?');
            params.push(`%${filters.nombre}%`);
        }
        if (filters.activo !== undefined) {
            whereConditions.push('p.activo = ?');
            params.push(filters.activo);
        }
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const orderClause = `ORDER BY p.${sort.field} ${sort.direction}`;
        const limitClause = `LIMIT ? OFFSET ?`;
        const selectQuery = `
            SELECT p.* FROM productos p 
            ${whereClause} 
            ${orderClause} 
            ${limitClause}
        `;
        const countQuery = `
            SELECT COUNT(*) as total FROM productos p 
            ${whereClause}
        `;
        return {
            select: selectQuery,
            count: countQuery,
            params: [...params, pagination.limit, pagination.offset]
        };
    }
    static validateBusinessRules(product) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validación de nombre único
            const { data: existingProduct } = yield config_supabaseStorage_1.default
                .from('productos')
                .select('id_producto')
                .eq('nombre_producto', product.nombre_producto)
                .single();
            if (existingProduct) {
                throw new Error('El nombre del producto ya existe');
            }
            // Validación de categoría existente
            if (product.id_categoria) {
                const { data: category } = yield config_supabaseStorage_1.default
                    .from('categorias')
                    .select('id_categoria')
                    .eq('id_categoria', product.id_categoria)
                    .single();
                if (!category) {
                    throw new Error('La categoría especificada no existe');
                }
            }
            // Validación de precio
            if (product.precio < 0) {
                throw new Error('El precio no puede ser negativo');
            }
        });
    }
    static detectChanges(current, updates) {
        const changes = {};
        if (updates.nombre_producto !== undefined && updates.nombre_producto !== current.nombre_producto) {
            changes.nombre_producto = updates.nombre_producto;
        }
        if (updates.precio !== undefined && updates.precio !== current.precio) {
            changes.precio = updates.precio;
        }
        if (updates.descripcion !== undefined && updates.descripcion !== current.descripcion) {
            changes.descripcion = updates.descripcion;
        }
        if (updates.id_categoria !== undefined && updates.id_categoria !== current.id_categoria) {
            changes.id_categoria = updates.id_categoria;
        }
        return changes;
    }
    static checkDependencies(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: inventoryData } = yield config_supabaseStorage_1.default
                .from('inventario')
                .select('id')
                .eq('id_producto', productId)
                .limit(1);
            const { data: presaleData } = yield config_supabaseStorage_1.default
                .from('microservice_presale')
                .select('id')
                .eq('id_producto', productId)
                .limit(1);
            return !!(inventoryData && inventoryData.length > 0) || !!(presaleData && presaleData.length > 0);
        });
    }
}
OptimizedProductService.DEFAULT_PAGE_SIZE = 20;
OptimizedProductService.MAX_PAGE_SIZE = 100;
OptimizedProductService.CACHE_TTL = 10 * 60 * 1000; // 10 minutos
exports.default = OptimizedProductService;
