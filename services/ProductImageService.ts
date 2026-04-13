import ProductImageRepository from '../repositories/ProductImageRepository';
import ProductImage from '../Dto/productDto/ProductImageDto';
import ImageService from './ImageService';
import RegisterImage from '../Dto/imageDto/RegisterImageDto';
import DeleteImage from '../Dto/imageDto/DeleteImageDto';

class ProductImageService {
    // Subir múltiples imágenes y asociarlas a un producto
    static async uploadMultipleImages(
        productId: number, 
        files: Express.Multer.File[], 
        primaryImageIndex?: number
    ): Promise<ProductImage[]> {
        if (!files || files.length === 0) {
            return [];
        }

        const uploadedImages: ProductImage[] = [];
        const errors: string[] = [];

        try {
            // Subir cada imagen a Supabase Storage
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                try {
                    // Validar que sea una imagen
                    if (!this.validateImageFile(file)) {
                        errors.push(`Archivo ${file.originalname} no es una imagen válida`);
                        continue;
                    }

                    // Subir imagen a Supabase
                    const registerImage = new RegisterImage(file.originalname, file.buffer);
                    const imageUrl = await ImageService.registerImage(registerImage);

                    if (!imageUrl) {
                        errors.push(`Error al subir imagen ${file.originalname}`);
                        continue;
                    }

                    // Extraer storage path de la URL
                    const storagePath = this.extractStoragePathFromUrl(imageUrl);

                    // Determinar si es la imagen principal
                    const isPrimary = primaryImageIndex !== undefined && i === primaryImageIndex;

                    // Crear objeto ProductImage
                    const productImage = new ProductImage(
                        productId,
                        imageUrl,
                        storagePath,
                        isPrimary
                    );

                    uploadedImages.push(productImage);

                } catch (error) {
                    console.error(`Error procesando archivo ${file.originalname}:`, error);
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                    errors.push(`Error procesando ${file.originalname}: ${errorMessage}`);
                }
            }

            // Guardar en base de datos
            if (uploadedImages.length > 0) {
                const savedImages = await ProductImageRepository.createMultipleImages(uploadedImages);
                
                if (errors.length > 0) {
                    console.warn('Algunas imágenes no se pudieron procesar:', errors);
                }
                
                return savedImages;
            } else {
                throw new Error('No se pudo subir ninguna imagen. Errores: ' + errors.join(', '));
            }

        } catch (error) {
            console.error('Error en uploadMultipleImages:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new Error(`Error al subir imágenes: ${errorMessage}`);
        }
    }

    // Obtener todas las imágenes de un producto
    static async getProductImages(productId: number): Promise<ProductImage[]> {
        try {
            return await ProductImageRepository.getImagesByProductId(productId);
        } catch (error) {
            console.error('Error obteniendo imágenes del producto:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new Error(`Error al obtener imágenes: ${errorMessage}`);
        }
    }

    // Obtener imagen principal de un producto
    static async getPrimaryImage(productId: number): Promise<ProductImage | null> {
        try {
            return await ProductImageRepository.getPrimaryImageByProductId(productId);
        } catch (error) {
            console.error('Error obteniendo imagen principal:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new Error(`Error al obtener imagen principal: ${errorMessage}`);
        }
    }

    // Eliminar una imagen específica
    static async deleteProductImage(imageId: number): Promise<boolean> {
        try {
            // Primero obtener la imagen para saber el storage_path
            const images = await ProductImageRepository.getImagesByProductId(0); // Esto no funcionará, necesitamos un método específico
            
            // Por ahora, eliminamos directamente de la base de datos
            const deleted = await ProductImageRepository.deleteImage(imageId);
            
            if (!deleted) {
                throw new Error('No se encontró la imagen para eliminar');
            }

            return true;
        } catch (error) {
            console.error('Error eliminando imagen del producto:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new Error(`Error al eliminar imagen: ${errorMessage}`);
        }
    }

    // Eliminar todas las imágenes de un producto
    static async deleteAllProductImages(productId: number): Promise<boolean> {
        try {
            // Obtener todas las imágenes para eliminarlas del storage
            const images = await ProductImageRepository.getImagesByProductId(productId);
            
            // Eliminar cada imagen del storage
            for (const image of images) {
                try {
                    const fileName = this.extractFileNameFromStoragePath(image.storage_path);
                    const deleteImage = new DeleteImage(fileName);
                    await ImageService.deleteImage(deleteImage);
                } catch (error) {
                    console.warn(`Error eliminando imagen del storage: ${image.storage_path}`, error);
                }
            }

            // Eliminar de la base de datos
            return await ProductImageRepository.deleteAllImagesByProductId(productId);
        } catch (error) {
            console.error('Error eliminando todas las imágenes del producto:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new Error(`Error al eliminar imágenes: ${errorMessage}`);
        }
    }

    // Establecer imagen principal
    static async setPrimaryImage(imageId: number, productId: number): Promise<boolean> {
        try {
            return await ProductImageRepository.setPrimaryImage(imageId, productId);
        } catch (error) {
            console.error('Error estableciendo imagen principal:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new Error(`Error al establecer imagen principal: ${errorMessage}`);
        }
    }

    // Validar que el archivo sea una imagen
    private static validateImageFile(file: Express.Multer.File): boolean {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        return allowedTypes.includes(file.mimetype) && file.size <= maxSize;
    }

    // Extraer storage_path de la URL de Supabase
    private static extractStoragePathFromUrl(url: string): string {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            return pathParts.slice(pathParts.indexOf('productos') + 1).join('/');
        } catch (error) {
            console.error('Error extrayendo storage path de URL:', error);
            return url;
        }
    }

    // Extraer nombre del archivo del storage_path
    private static extractFileNameFromStoragePath(storagePath: string): string {
        const parts = storagePath.split('/');
        return parts[parts.length - 1];
    }
}

export default ProductImageService;
