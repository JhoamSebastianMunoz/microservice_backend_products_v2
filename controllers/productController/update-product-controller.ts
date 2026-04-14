import {Request, Response} from 'express';
import UpdateProductRequest from '../../Dto/productDto/UpdateProductDto';
import ProductService from '../../services/ProductService';
import ProductImageService from '../../services/ProductImageService';
import { successResponse, notFoundResponse, createApiError } from '../../middleware/errorHandler';

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
            return res.status(404).json(notFoundResponse('Producto'));
        }

        // Delegar procesamiento de imágenes al servicio
        const imageResults = await ProductImageService.processProductImages(
            parseInt(id),
            images,
            delete_images,
            primary_image_index ? parseInt(primary_image_index) : undefined
        );

        return res.status(200).json(successResponse({
            product_id: parseInt(id),
            images: imageResults
        }, 'Producto actualizado con éxito'));
            
        }catch(error:any){
            throw createApiError(
                error.code === "ER_DUP_ENTRY" ? error.sqlMessage : "Error al actualizar producto",
                error.code === "ER_DUP_ENTRY" ? 409 : 500,
                error.message
            );
        }
};

export default update_product;