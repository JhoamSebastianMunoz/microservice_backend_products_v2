import { Request, Response } from "express";
import ImageUploadHelper from "../../Helpers/ImageUploadHelper";
import ProductImageRepository from "../../repositories/ProductImageRepository";
import ProductImage from "../../Dto/productDto/ProductImageDto";

interface UploadProductImageRequest extends Request {
    body: {
        product_id: string;
        is_primary?: string;
    };
}

const uploadProductImageEnhancedController = async (req: UploadProductImageRequest, res: Response) => {
    try {
        const { product_id, is_primary } = req.body;
        const file = req.file;

        // Validaciones básicas
        if (!file) {
            return res.status(400).json({ 
                message: "Error: No se proporcionó ningún archivo." 
            });
        }

        if (!product_id) {
            return res.status(400).json({ 
                message: "Error: El ID del producto es obligatorio." 
            });
        }

        const productId = parseInt(product_id);
        if (isNaN(productId)) {
            return res.status(400).json({ 
                message: "Error: El ID del producto debe ser un número válido." 
            });
        }

        // Subir imagen a Supabase Storage usando ImageUploadHelper
        const uploadResult = await ImageUploadHelper.uploadProductImage(
            file.buffer,
            file.originalname,
            product_id,
            {
                maxSizeMB: 10, // 10MB máximo
                allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
                folder: 'productos'
            }
        );

        // Determinar si es imagen principal
        const isPrimaryImage = is_primary === 'true' || is_primary === '1';

        // Si se marca como principal, primero quitar el estado principal a las demás imágenes
        if (isPrimaryImage) {
            await ProductImageRepository.setPrimaryImage(-1, productId); // Reinicia todas a false
        }

        // Guardar en la base de datos
        const productImage = new ProductImage(
            productId,
            uploadResult.url,
            uploadResult.path,
            isPrimaryImage
        );

        const savedImages = await ProductImageRepository.createMultipleImages([productImage]);

        // Si se marcó como principal, establecer esta como imagen principal
        if (isPrimaryImage && savedImages.length > 0) {
            await ProductImageRepository.setPrimaryImage(savedImages[0].id!, productId);
        }

        res.status(201).json({ 
            message: "Imagen subida correctamente.", 
            data: {
                id: savedImages[0]?.id,
                product_id: productId,
                image_url: uploadResult.url,
                storage_path: uploadResult.path,
                is_primary: isPrimaryImage,
                created_at: savedImages[0]?.created_at
            }
        });

    } catch (error) {
        console.error("Error al subir imagen de producto:", error);
        
        // Manejar diferentes tipos de errores
        if (error instanceof Error) {
            if (error.message.includes('tamaño máximo')) {
                return res.status(413).json({ message: error.message });
            }
            if (error.message.includes('Formato de archivo no permitido')) {
                return res.status(415).json({ message: error.message });
            }
            if (error.message.includes('Extensión de archivo no válida')) {
                return res.status(415).json({ message: error.message });
            }
        }

        res.status(500).json({ 
            message: "Error al subir la imagen de producto.",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

export default uploadProductImageEnhancedController;
