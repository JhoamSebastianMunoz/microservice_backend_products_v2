import { CreateProductRequest, ProductResponse, Product } from '../Dto/productDto/ProductDto';
import UpdateProductRequest from '../Dto/productDto/UpdateProductDto';
import GetProductRequest from '../Dto/productDto/GetProductDto';
import DeleteProductRequest from '../Dto/productDto/DeleteProductDto';
import ProductRepository from '../repositories/ProductRepository';
import { cacheMiddleware, invalidateCache } from '../middleware/cacheMiddleware';
import supabaseClient from '../config/config-supabaseStorage';

interface PaginationOptions {
    page: number;
    limit: number;
    offset: number;
}

interface FilterOptions {
    id_categoria?: number;
    precio_min?: number;
    precio_max?: number;
    nombre?: string;
    activo?: boolean;
}

interface SortOptions {
    field: string;
    direction: 'ASC' | 'DESC';
}

interface ProductQuery {
    pagination?: PaginationOptions;
    filters?: FilterOptions;
    sort?: SortOptions;
}

class OptimizedProductService {
    private static readonly DEFAULT_PAGE_SIZE = 20;
    private static readonly MAX_PAGE_SIZE = 100;
    private static readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutos

    // Obtener productos con paginación, filtros y ordenamiento
    static async getProductsOptimized(query: ProductQuery = {}): Promise<{
        products: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }> {
        try {
            const {
                pagination = { page: 1, limit: this.DEFAULT_PAGE_SIZE },
                filters = {},
                sort = { field: 'nombre_producto', direction: 'ASC' }
            } = query;

            // Validar y normalizar paginación
            const limit = Math.min(pagination.limit, this.MAX_PAGE_SIZE);
            const page = Math.max(1, pagination.page);
            const offset = (page - 1) * limit;

            // Construir consulta optimizada
            const queryBuilder = this.buildOptimizedQuery(filters, sort, { limit, offset });

            // Ejecutar consulta con conteo en paralelo para mejor rendimiento
            const [productsResult, totalCountResult] = await Promise.all([
                supabaseClient
                    .from('productos')
                    .select('*', { count: 'exact' })
                    .range(offset, offset + limit - 1)
                    .order(sort.field, { ascending: sort.direction === 'ASC' }),
                supabaseClient
                    .from('productos')
                    .select('*', { count: 'exact', head: true })
            ]);

            if (productsResult.error) throw productsResult.error;
            if (totalCountResult.error) throw totalCountResult.error;

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
        } catch (error) {
            console.error('Error en getProductsOptimized:', error);
            throw error;
        }
    }

    // Obtener producto con sus relaciones precargadas
    static async getProductWithRelations(id: number): Promise<ProductResponse | null> {
        try {
            // Consulta optimizada con JOIN para obtener producto e imágenes en una sola consulta
            const { data: productData, error: productError } = await supabaseClient
                .from('productos')
                .select(`
                    *,
                    producto_imagenes(id_imagen),
                    imagenes(id_imagen, url_imagen, es_principal)
                `)
                .eq('id_producto', id)
                .single();

            if (productError) throw productError;
            if (!productData) return null;

            const results = [productData];

            if (results.length === 0) {
                return null;
            }

            // Procesar resultados para estructurar datos correctamente
            const product = {
                ...results[0],
                imagenes: results[0].producto_imagenes?.map((pi: any) => ({
                    id: pi.id_imagen,
                    url_imagen: pi.imagenes?.url_imagen,
                    es_principal: pi.imagenes?.es_principal
                })) || []
            };

            // Eliminar propiedades duplicadas
            delete product.producto_imagenes;

            return product as ProductResponse;
        } catch (error) {
            console.error('Error en getProductWithRelations:', error);
            throw error;
        }
    }

    // Crear producto con validación optimizada
    static async createProductOptimized(product: CreateProductRequest): Promise<any> {
        try {
            // Validación de negocio optimizada
            await this.validateBusinessRules(product);

            // Inserción con retorno de ID
            const result = await ProductRepository.add(product as Product);

            // Invalidar caché relacionada
            invalidateCache('/api/v2/products');

            return result;
        } catch (error) {
            console.error('Error en createProductOptimized:', error);
            throw error;
        }
    }

    // Actualizar producto con validación de cambios
    static async updateProductOptimized(product: UpdateProductRequest): Promise<any> {
        try {
            // Obtener producto actual para comparar cambios
            const currentProductResult = await ProductRepository.get({ id: product.id });
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
            const updateData = { id: product.id, ...changes } as any;
            const result = await ProductRepository.update(updateData);

            // Invalidar caché
            invalidateCache(`/api/v2/products/${product.id}`);
            invalidateCache('/api/v2/products');

            return result;
        } catch (error) {
            console.error('Error en updateProductOptimized:', error);
            throw error;
        }
    }

    // Eliminar producto con manejo de dependencias
    static async deleteProductOptimized(request: DeleteProductRequest): Promise<boolean> {
        try {
            // Verificar dependencias antes de eliminar
            const hasDependencies = await this.checkDependencies(request.id);
            if (hasDependencies) {
                throw new Error('No se puede eliminar el producto debido a dependencias existentes');
            }

            // Eliminación en cascada optimizada
            const result = await ProductRepository.delete({ id_producto: request.id } as any);

            // Invalidar caché
            invalidateCache(`/api/v2/products/${request.id}`);
            invalidateCache('/api/v2/products');

            return result;
        } catch (error) {
            console.error('Error en deleteProductOptimized:', error);
            throw error;
        }
    }

    // Métodos privados de optimización
    private static buildOptimizedQuery(
        filters: FilterOptions,
        sort: SortOptions,
        pagination: { limit: number; offset: number }
    ): { select: string; count: string; params: any[] } {
        let whereConditions: string[] = [];
        let params: any[] = [];

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

    private static async validateBusinessRules(product: CreateProductRequest): Promise<void> {
        // Validación de nombre único
        const { data: existingProduct } = await supabaseClient
            .from('productos')
            .select('id_producto')
            .eq('nombre_producto', product.nombre_producto)
            .single();
        
        if (existingProduct) {
            throw new Error('El nombre del producto ya existe');
        }

        // Validación de categoría existente
        if (product.id_categoria) {
            const { data: category } = await supabaseClient
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
    }

    private static detectChanges(current: any, updates: UpdateProductRequest): Partial<UpdateProductRequest> {
        const changes: Partial<UpdateProductRequest> = {};

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

    private static async checkDependencies(productId: number): Promise<boolean> {
        const { data: inventoryData } = await supabaseClient
            .from('inventario')
            .select('id')
            .eq('id_producto', productId)
            .limit(1);
            
        const { data: presaleData } = await supabaseClient
            .from('microservice_presale')
            .select('id')
            .eq('id_producto', productId)
            .limit(1);
            
        return !!(inventoryData && inventoryData.length > 0) || !!(presaleData && presaleData.length > 0);
    }
}

export default OptimizedProductService;
