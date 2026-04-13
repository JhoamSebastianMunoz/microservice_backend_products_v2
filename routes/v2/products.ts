import express from "express";
import registerProductValidator from '../../middleware/productMiddleware/registerProductValidator';
import getProductValidator from '../../middleware/productMiddleware/getProductValidator';
import updateProductValidator from '../../middleware/productMiddleware/updateProductValidator';
import deleteProductValidator from '../../middleware/productMiddleware/deleteProductValidator';
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
    registerProductValidator.validatorParams, 
    registerProductValidator.validator,
    registerMultipleImagesValidator,
    registerProductController
);

// GET /api/v2/products - Get all products
router.get('/', getProductsController);

// GET /api/v2/products/:id - Get specific product
router.get('/:id', getProductValidator.validatorParams, getProductValidator.validator, getProductController);

// PUT /api/v2/products/:id - Update product
router.put('/:id', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    updateProductValidator.validatorParams, 
    updateProductValidator.validator,
    updateProductController
);

// DELETE /api/v2/products/:id - Delete product
router.delete('/:id', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    deleteProductValidator.validatorParams,
    deleteProductValidator.validator,
    deleteProductController
);

export default router;
