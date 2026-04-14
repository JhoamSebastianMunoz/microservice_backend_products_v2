import { Request, Response } from "express";
import ProductService from '../../services/ProductService';
import { successResponse, createApiError } from '../../middleware/errorHandler';

let get_products = async (req: Request, res: Response) => {  
    try {
        const result = await ProductService.getProducts()
        return res.status(200).json(successResponse(result));
        } catch (error: any) {    
            throw createApiError(
                "Error al obtener productos",
                500,
                error.message
            );
        }
    };

    export default get_products;