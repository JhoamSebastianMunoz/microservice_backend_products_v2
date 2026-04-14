import { CreateProductRequest, UpdateProductRequest, ProductResponse, ProductImage } from '../Dto/productDto/ProductDto';
import ProductService from './ProductService';
import ProductImageService from './ProductImageService';
import ProductImageDto from '../Dto/productDto/ProductImageDto';

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
                ...productData,
                cantidad_ingreso: productData.cantidad_ingreso || 0,
                imagenes: processedImages.map(img => ({
                    id: img.id,
                    url_imagen: img.url_imagen,
                    es_principal: img.es_principal
                }))
            };
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
            const result = await ProductService.updateProduct(request);
            
            if (!result || result.affectedRows === 0) {
                throw new Error('Producto no encontrado');
            }
            
            // Procesar imágenes
            const imageResults = await ProductImageService.processProductImages(
                request.id,
                images || [],
                delete_images,
                primary_image_index
            );
            
            // Obtener datos actualizados del producto
            const getProductRequest = { id: request.id };
            const updatedProduct = await ProductService.getProduct(getProductRequest);
            
            if (!updatedProduct || updatedProduct.length === 0) {
                throw new Error('No se pudo obtener el producto actualizado');
            }
            
            return {
                ...updatedProduct[0],
                imagenes: imageResults.uploaded.map(img => ({
                    id: img.id,
                    url_imagen: img.url_imagen,
                    es_principal: img.es_principal
                }))
            };
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
                ...productResult[0],
                imagenes: images.map((img: ProductImageDto) => ({
                    id: img.id,
                    url_imagen: img.url_imagen,
                    es_principal: img.es_principal
                }))
            };
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
