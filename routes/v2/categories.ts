import express from "express";
import verifyToken from "../../middleware/verifyToken";
import checkRoleAndPermission from "../../middleware/checkRoleAndPermission";
import registerCategoryValidator from "../../middleware/categoryMiddleware/registerCategoryValidator";
import registerCategoryController from "../../controllers/categoryController/register-category-controller";
import getAllCategoriesController from "../../controllers/categoryController/getAll-category-controller";
import getByIdCategoryController from "../../controllers/categoryController/getById-category-controller";
import updateCategoryController from "../../controllers/categoryController/update-category-controller";
import deleteCategoryController from "../../controllers/categoryController/delete-category-controller";

const router = express.Router();

// POST /api/v2/categories - Create new category
router.post('/',  
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    registerCategoryValidator.validatorParams, 
    registerCategoryValidator.validator, 
    registerCategoryController
);

// GET /api/v2/categories - Get all categories
router.get('/', getAllCategoriesController);

// GET /api/v2/categories/:id - Get specific category
router.get('/:id', getByIdCategoryController);

// PUT /api/v2/categories/:id - Update category
router.put('/:id', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    registerCategoryValidator.validatorParams, 
    registerCategoryValidator.validator,
    updateCategoryController
);

// DELETE /api/v2/categories/:id - Delete category
router.delete('/:id', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    deleteCategoryController
);

export default router;
