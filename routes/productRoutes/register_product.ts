import express from "express";
import registerProductValidator from '../../middleware/productMiddleware/registerProductValidator';
import registerProductController from '../../controllers/productController/register-product-controller';
import verifyToken from "../../middleware/verifyToken";
import checkRoleAndPermission from "../../middleware/checkRoleAndPermission";
import registerMultipleImagesValidator from '../../middleware/imageMiddleware/registerMultipleImagesValidator';


const router = express.Router();


router.post('/',  
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    registerProductValidator.validatorParams, 
    registerProductValidator.validator,
    registerMultipleImagesValidator,
    registerProductController
);


export default router;