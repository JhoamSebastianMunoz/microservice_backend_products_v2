import { CreateProductRequest, UpdateProductRequest, ProductResponse, ProductImage, ProductImageDto } from '../Dto/productDto/ProductDto';
import ProductService from './ProductService';
import ProductImageService from './ProductImageService';

// Interfaz para las estrategias de producto
export interface ProductOperationStrategy {
    execute(request: any): Promise<any>;
}

// Estrategia para crear producto con imágenes
export class CreateProductWithImagesStrategy implements ProductOperationStrategy {
    async execute(request: CreateProductRequest & { images?: Express.Multer.File[], primary_image_index?: number }): Promise<ProductResponse> {
        try {
            // Extraer datos del producto
            const { images, primary_image_index, ...productData } = request;
            
            // Crear producto
            const result = await ProductService.register_product(productData);
            
            if (!result?.insertId) {
                throw new Error('No se pudo crear el producto');
            }
            
            // Procesar imágenes si existen
            let processedImages: ProductImageDto[] = [];
            if (images && images.length > 0) {
                processedImages = await ProductImageService.uploadMultipleImages(
                    result.insertId,
                    images,
                    primary_image_index
                );
            }
            
            return {
                id: result.insertId,
                nombre_producto: productData.nombre_producto,
                precio: productData.precio,
                descripcion: productData.descripcion,
                cantidad_ingreso: productData.cantidad_ingreso || 0,
                id_categoria: productData.id_categoria,
                imagenes: processedImages.map(img => ({
                    id: img.id!,
                    url_imagen: (img as any).url_imagen || (img as any).image_url!,
                    es_principal: (img as any).es_principal || (img as any).is_primary!
                }))
            } as ProductResponse;
        } catch (error) {
            throw error;
        }
    }
}

// Estrategia para actualizar producto con gestión de imágenes
export class UpdateProductWithImagesStrategy implements ProductOperationStrategy {
    async execute(request: UpdateProductRequest & { 
        images?: Express.Multer.File[], 
        delete_images?: string[], 
        primary_image_index?: number 
    }): Promise<ProductResponse> {
        try {
            const { images, delete_images, primary_image_index } = request;
            
            // Actualizar datos del producto
            const result = await ProductService.updateProduct({
                id: (request as any).id,
                nombre_producto: request.nombre_producto,
                precio: request.precio,
                descripcion: request.descripcion,
                id_categoria: request.id_categoria
            });
            
            if (!result || result.affectedRows === 0) {
                throw new Error('Producto no encontrado');
            }
            
            // Procesar imágenes
            const imageResults = await ProductImageService.processProductImages(
                (request as any).id,
                images || [],
                delete_images,
                primary_image_index
            );
            
            // Obtener datos actualizados del producto
            const getProductRequest = { id: (request as any).id };
            const updatedProduct = await ProductService.getProduct(getProductRequest);
            
            if (!updatedProduct || updatedProduct.length === 0) {
                throw new Error('No se pudo obtener el producto actualizado');
            }
            
            return {
                id: (updatedProduct[0] as any).id,
                nombre_producto: (updatedProduct[0] as any).nombre_producto,
                precio: (updatedProduct[0] as any).precio,
                descripcion: (updatedProduct[0] as any).descripcion,
                cantidad_ingreso: (updatedProduct[0] as any).cantidad_ingreso,
                id_categoria: (updatedProduct[0] as any).id_categoria,
                imagenes: imageResults.uploaded.map(img => ({        
                    id: img.id!,
                    url_imagen: (img as any).url_imagen || (img as any).image_url!,
                    es_principal: (img as any).es_principal || (img as any).is_primary!
                }))
            } as ProductResponse;
        } catch (error) {
            throw error;
        }
    }
}

// Estrategia para obtener producto con imágenes
export class GetProductWithImagesStrategy implements ProductOperationStrategy {
    async execute(request: { id: number }): Promise<ProductResponse> {
        try {
            const { id } = request;
            
            // Obtener datos del producto
            const productResult = await ProductService.getProduct({ id });
            
            if (!productResult || productResult.length === 0) {
                throw new Error('Producto no encontrado');
            }
            
            // Obtener imágenes del producto
            const images = await ProductImageService.getProductImages(id);
            
            return {
                id: (productResult[0] as any).id,
                nombre_producto: (productResult[0] as any).nombre_producto,
                precio: (productResult[0] as any).precio,
                descripcion: (productResult[0] as any).descripcion,
                cantidad_ingreso: (productResult[0] as any).cantidad_ingreso,
                id_categoria: (productResult[0] as any).id_categoria,
                imagenes: images.map((img: ProductImageDto) => ({   
                    id: img.id!,
                    url_imagen: (img as any).url_imagen || (img as any).image_url!,
                    es_principal: (img as any).es_principal || (img as any).is_primary!
                }))
            } as ProductResponse;
        } catch (error) {
            throw error;
        }
    }
}

// Fábrica de estrategias
export class ProductStrategyFactory {
    static createStrategy(operation: 'create' | 'update' | 'get'): ProductOperationStrategy {
        switch (operation) {
            case 'create':
                return new CreateProductWithImagesStrategy();
            case 'update':
                return new UpdateProductWithImagesStrategy();
            case 'get':
                return new GetProductWithImagesStrategy();
            default:
                throw new Error(`Operación no soportada: ${operation}`);
        }
    }
}

// Servicio de alto nivel que utiliza las estrategias
export class ProductOperationService {
    static async executeOperation<T>(
        operation: 'create' | 'update' | 'get',
        request: T
    ): Promise<any> {
        const strategy = ProductStrategyFactory.createStrategy(operation);
        return await strategy.execute(request);
    }
}
