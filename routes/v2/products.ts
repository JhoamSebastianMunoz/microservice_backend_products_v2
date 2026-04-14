import express from "express";
import { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } from '../../middleware/productValidators';
import { handleValidationErrors } from '../../middleware/validationMiddleware';
import { errorHandler } from '../../middleware/errorHandler';
import registerProductController from '../../controllers/productController/register-product-controller';
import getProductsController from '../../controllers/productController/get-products-controller';
import getProductController from '../../controllers/productController/get-product-controller';
import updateProductController from '../../controllers/productController/update-product-controller';
import deleteProductController from '../../controllers/productController/delete-product-controller';
import verifyToken from "../../middleware/verifyToken";
import checkRoleAndPermission from "../../middleware/checkRoleAndPermission";
import registerMultipleImagesValidator from '../../middleware/imageMiddleware/registerMultipleImagesValidator';

const router = express.Router();

// POST /api/v2/products - Create new product
router.post('/',  
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    createProductValidator,
    handleValidationErrors,
    registerMultipleImagesValidator,
    registerProductController
);

// GET /api/v2/products - Get all products
router.get('/', getProductsController);

// GET /api/v2/products/:id - Get specific product
router.get('/:id', getProductValidator, handleValidationErrors, getProductController);

// PUT /api/v2/products/:id - Update product
router.put('/:id', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    updateProductValidator,
    handleValidationErrors,
    updateProductController
);

// DELETE /api/v2/products/:id - Delete product
router.delete('/:id', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    deleteProductValidator,
    handleValidationErrors,
    deleteProductController
);

// Aplicar manejador de errores centralizado a todas las rutas
router.use(errorHandler);

export default router;
