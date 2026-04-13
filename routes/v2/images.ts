import express from "express";
import uploadImageProductController from '../../controllers/imageController/upload-image-product-controller';
import getImageController from '../../controllers/imageController/get-image-controller';
import deleteImageController from '../../controllers/imageController/delete-image-controller';
import verifyToken from "../../middleware/verifyToken";
import checkRoleAndPermission from "../../middleware/checkRoleAndPermission";

const router = express.Router();

// POST /api/v2/images/upload - Upload image
router.post('/upload',  
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    uploadImageProductController
);

// GET /api/v2/images/:id - Get image
router.get('/:id', getImageController);

// DELETE /api/v2/images/:id - Delete image
router.delete('/:id', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    deleteImageController
);

export default router;
