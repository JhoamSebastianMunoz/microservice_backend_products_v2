import { Request, Response } from "express";
import DeleteProductRequest from "../../Dto/productDto/DeleteProductDto";
import ProductService from '../../services/ProductService';
import { successResponse, notFoundResponse, createApiError } from '../../middleware/errorHandler';

let delete_product = async (req: Request, res: Response) => {  
    try {
        const { id } = req.params;
        const deleteProductRequest: DeleteProductRequest = { id: parseInt(id) };
        const result = await ProductService.deleteProduct(deleteProductRequest);
        if (!result) {
            return res.status(404).json(notFoundResponse('Producto'));
        }
        else {
            return res.status(200).json(successResponse(null, 'Producto eliminado con éxito'));
        }
    } catch (error: any) {
        if (error.code === "ER_ROW_IS_REFERENCED") {
            throw createApiError(
                "No se puede eliminar el producto debido a referencias existentes en otros registros",
                409,
                error.message
            );
        }
        throw createApiError(
            "Error al eliminar producto",
            500,
            error.message
        );
    }
};

export default delete_product;