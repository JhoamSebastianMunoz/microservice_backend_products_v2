import { Request, Response } from "express";
import { CreateProductRequest } from '../../Dto/productDto/ProductDto';
import ProductService from '../../services/ProductService';
import ProductImageService from '../../services/ProductImageService';
import { successResponse, createApiError } from '../../middleware/errorHandler';

let register_product = async (req: Request, res: Response) => {  
  try {
    const {
      nombre_producto,
      precio,
      descripcion,
      cantidad_ingreso,
      id_categoria,
      primary_image_index
    } = req.body;

    // Extraer archivos de imágenes del request
    const images = req.files as Express.Multer.File[] || [];

    // Crear objeto de producto con la nueva interface
    const product: CreateProductRequest = {
      nombre_producto,
      precio,
      descripcion,
      cantidad_ingreso,
      id_categoria
    };
    
    const result = await ProductService.register_product(product);
    
    // Si el producto se creó exitosamente y hay imágenes, subirlas
    if (result && result.insertId && images.length > 0) {
      try {
        const uploadedImages = await ProductImageService.uploadMultipleImages(
          result.insertId, 
          images, 
          primary_image_index ? parseInt(primary_image_index) : undefined
        );
        
        return res.status(201).json(successResponse({
          product_id: result.insertId,
          images: uploadedImages
        }, 'Producto registrado con éxito', 201));
      } catch (imageError) {
        console.error('Error subiendo imágenes:', imageError);
        // El producto se creó pero las imágenes fallaron, retornar advertencia
        return res.status(201).json(successResponse({
          product_id: result.insertId,
          image_error: imageError instanceof Error ? imageError.message : 'Error desconocido'
        }, 'Producto registrado con éxito, pero hubo errores al subir las imágenes', 201));
      }
    }
    
    return res.status(201).json(successResponse({
      product_id: result?.insertId
    }, 'Producto registrado con éxito', 201));
    
  } catch (error: any) {    
    throw createApiError(
      error.code === "ER_DUP_ENTRY" ? error.sqlMessage : "Error al registrar producto",
      error.code === "ER_DUP_ENTRY" ? 409 : 500,
      error.message
    );
  }
};


export default register_product;