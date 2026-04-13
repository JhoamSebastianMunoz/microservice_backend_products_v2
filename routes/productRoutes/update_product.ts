import express from 'express';
import updateProductValidator from '../../middleware/productMiddleware/updateProductValidator';
import updateProductController from '../../controllers/productController/update-product-controller';
import verifyToken from '../../middleware/verifyToken';
import checkRoleAndPermission from '../../middleware/checkRoleAndPermission';
import registerMultipleImagesValidator from '../../middleware/imageMiddleware/registerMultipleImagesValidator';


const router = express.Router();

router.put('/:id_producto', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    updateProductValidator.validatorParams, 
    updateProductValidator.validator,
    registerMultipleImagesValidator,
    updateProductController
);

export default router;