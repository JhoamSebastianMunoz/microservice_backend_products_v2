import express from "express";
import ProductImageService from '../../services/ProductImageService';
import verifyToken from "../../middleware/verifyToken";
import checkRoleAndPermission from "../../middleware/checkRoleAndPermission";

const router = express.Router();

// Obtener todas las imágenes de un producto
router.get('/:product_id/images', async (req, res) => {
    try {
        const { product_id } = req.params;
        const images = await ProductImageService.getProductImages(parseInt(product_id));
        res.status(200).json({ images });
    } catch (error) {
        console.error('Error obteniendo imágenes del producto:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: "Error al obtener imágenes", details: errorMessage });
    }
});

// Obtener imagen principal de un producto
router.get('/:product_id/images/primary', async (req, res) => {
    try {
        const { product_id } = req.params;
        const image = await ProductImageService.getPrimaryImage(parseInt(product_id));
        
        if (!image) {
            return res.status(404).json({ error: "No se encontró imagen principal para este producto" });
        }
        
        res.status(200).json({ image });
    } catch (error) {
        console.error('Error obteniendo imagen principal:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: "Error al obtener imagen principal", details: errorMessage });
    }
});

// Establecer imagen principal
router.put('/:product_id/images/:image_id/set-primary', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    async (req, res) => {
        try {
            const { product_id, image_id } = req.params;
            const success = await ProductImageService.setPrimaryImage(
                parseInt(image_id), 
                parseInt(product_id)
            );
            
            if (!success) {
                return res.status(404).json({ error: "No se encontró la imagen o el producto" });
            }
            
            res.status(200).json({ status: 'Imagen principal establecida con éxito' });
        } catch (error) {
            console.error('Error estableciendo imagen principal:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            res.status(500).json({ error: "Error al establecer imagen principal", details: errorMessage });
        }
    }
);

// Eliminar una imagen específica
router.delete('/:product_id/images/:image_id', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    async (req, res) => {
        try {
            const { image_id } = req.params;
            const success = await ProductImageService.deleteProductImage(parseInt(image_id));
            
            if (!success) {
                return res.status(404).json({ error: "No se encontró la imagen" });
            }
            
            res.status(200).json({ status: 'Imagen eliminada con éxito' });
        } catch (error) {
            console.error('Error eliminando imagen:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            res.status(500).json({ error: "Error al eliminar imagen", details: errorMessage });
        }
    }
);

// Eliminar todas las imágenes de un producto
router.delete('/:product_id/images', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    async (req, res) => {
        try {
            const { product_id } = req.params;
            const success = await ProductImageService.deleteAllProductImages(parseInt(product_id));
            
            if (!success) {
                return res.status(404).json({ error: "No se encontraron imágenes para este producto" });
            }
            
            res.status(200).json({ status: 'Todas las imágenes eliminadas con éxito' });
        } catch (error) {
            console.error('Error eliminando imágenes del producto:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            res.status(500).json({ error: "Error al eliminar imágenes", details: errorMessage });
        }
    }
);

export default router;
