import { Request, Response } from "express";
import Product from '../../Dto/productDto/ProductDto';
import ProductService from '../../services/ProductService';
import ProductImageService from '../../services/ProductImageService';

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

    // Crear producto sin imagen (las imágenes se manejan por separado)
    const product = new Product(nombre_producto, precio, descripcion, cantidad_ingreso, id_categoria);
    const result = await ProductService.register_product(product);
    
    // Si el producto se creó exitosamente y hay imágenes, subirlas
    if (result && result.insertId && images.length > 0) {
      try {
        const uploadedImages = await ProductImageService.uploadMultipleImages(
          result.insertId, 
          images, 
          primary_image_index ? parseInt(primary_image_index) : undefined
        );
        
        return res.status(201).json({
          status: 'Producto registrado con éxito',
          product_id: result.insertId,
          images: uploadedImages
        });
      } catch (imageError) {
        console.error('Error subiendo imágenes:', imageError);
        // El producto se creó pero las imágenes fallaron, retornar advertencia
        return res.status(201).json({
          status: 'Producto registrado con éxito, pero hubo errores al subir las imágenes',
          product_id: result.insertId,
          image_error: imageError instanceof Error ? imageError.message : 'Error desconocido'
        });
      }
    }
    
    return res.status(201).json({
      status: 'Producto registrado con éxito',
      product_id: result?.insertId
    });
    
  } catch (error: any) {    
    if (error && error.code == "ER_DUP_ENTRY") {
        return res.status(500).json({ errorInfo: error.sqlMessage });
    } else {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  }
};


export default register_product;