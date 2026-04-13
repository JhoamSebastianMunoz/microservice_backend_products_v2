import { Request, Response } from "express";
import DeleteProductRequest from "../../Dto/productDto/DeleteProductDto";
import ProductService from '../../services/ProductService';



let delete_product = async (req: Request, res: Response) => {  
    try {
        const { id } = req.params;
        const deleteProductRequest: DeleteProductRequest = { id: parseInt(id) };
        const result = await ProductService.deleteProduct(deleteProductRequest);
        if (!result) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }
        else {
            return res.status(200).json({ message: "Producto eliminado con éxito." });
        }
    } catch (error: any) {
        if (error.code === "ER_ROW_IS_REFERENCED") {
            return res.status(409).json({ error: "No se puede eliminar el producto debido a referencias existentes en otros registros." });
        }
        return res.status(500).json({ error: "Error interno del servidor", details: error.message });
    }
};

    export default delete_product;