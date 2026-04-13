import {Request, Response} from 'express';
import UpdateProductRequest from '../../Dto/productDto/UpdateProductDto';
import ProductService from '../../services/ProductService';
import ProductImageService from '../../services/ProductImageService';

let update_product = async(req:Request, res:Response)=>{
    try {
        const{ id } =req.params;
        const {
            nombre_producto,
            precio,
            descripcion,
            id_categoria,
            primary_image_index,
            delete_images
            } = req.body;
        
        // Extraer archivos de imágenes del request
        const images = req.files as Express.Multer.File[] || [];

        // Actualizar datos del producto
        const updateProductRequest: UpdateProductRequest = {
            id: parseInt(id),
            nombre_producto,
            precio,
            descripcion,
            id_categoria
        };
        const result = await ProductService.updateProduct(updateProductRequest);
        
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        // Procesar imágenes si hay nuevas o se solicita eliminar
        const imageResults: {
            uploaded: any[],
            deleted: string[],
            errors: string[]
        } = {
            uploaded: [],
            deleted: [],
            errors: []
        };

        try {
            // Eliminar imágenes solicitadas
            if (delete_images && Array.isArray(delete_images)) {
                for (const imageId of delete_images) {
                    try {
                        await ProductImageService.deleteProductImage(parseInt(imageId));
                        imageResults.deleted.push(imageId);
                    } catch (error) {
                        imageResults.errors.push(`Error eliminando imagen ${imageId}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
                    }
                }
            }

            // Subir nuevas imágenes
            if (images.length > 0) {
                try {
                    const uploadedImages = await ProductImageService.uploadMultipleImages(
                        parseInt(id), 
                        images, 
                        primary_image_index ? parseInt(primary_image_index) : undefined
                    );
                    imageResults.uploaded = uploadedImages;
                } catch (error) {
                    imageResults.errors.push(`Error subiendo imágenes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
                }
            }

            // Establecer imagen principal si se especificó
            if (primary_image_index !== undefined && imageResults.uploaded.length > 0) {
                const primaryImageId = imageResults.uploaded[parseInt(primary_image_index)]?.id;
                if (primaryImageId) {
                    try {
                        await ProductImageService.setPrimaryImage(primaryImageId, parseInt(id));
                    } catch (error) {
                        imageResults.errors.push(`Error estableciendo imagen principal: ${error instanceof Error ? error.message : 'Error desconocido'}`);
                    }
                }
            }

        } catch (error) {
            console.error('Error procesando imágenes:', error);
            imageResults.errors.push(`Error general procesando imágenes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }

        return res.status(200).json({
            status: 'Producto actualizado con éxito',
            product_id: id,
            images: imageResults
        });
            
        }catch(error:any){
            if(error && error.code == "ER_DUP_ENTRY"){
                return res.status(500).json({errorInfo: error.sqlMessage})
            }else{
                return res.status(500).json({error: "Internal Server Error", details: error.message })
            }
        }
};

export default update_product;