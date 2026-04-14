import { Request, Response } from "express";
import GetProductRequest from "../../Dto/productDto/GetProductDto";
import ProductService from '../../services/ProductService';
import { successResponse, notFoundResponse, createApiError } from '../../middleware/errorHandler';

let get_product = async (req: Request, res: Response) => {  
    try {
        const { id } = req.params;
        const getProductRequest: GetProductRequest = { id: parseInt(id) };
        const result = await ProductService.getProduct(getProductRequest);
        if(result.length === 0) {
            return res.status(404).json(notFoundResponse('Producto'));
        }else{
            return res.status(200).json(successResponse(result));
        }
        
        } catch (error: any) {    
            throw createApiError(
                "Error al obtener producto",
                500,
                error.message
            );
        }
    };

    export default get_product;