"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const registerCategoryValidator_1 = __importDefault(require("../../middleware/categoryMiddleware/registerCategoryValidator"));
const register_category_controller_1 = __importDefault(require("../../controllers/categoryController/register-category-controller"));
const getAll_category_controller_1 = __importDefault(require("../../controllers/categoryController/getAll-category-controller"));
const getById_category_controller_1 = __importDefault(require("../../controllers/categoryController/getById-category-controller"));
const update_category_controller_1 = __importDefault(require("../../controllers/categoryController/update-category-controller"));
const delete_category_controller_1 = __importDefault(require("../../controllers/categoryController/delete-category-controller"));
const router = express_1.default.Router();
// POST /api/v2/categories - Create new category
router.post('/', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), registerCategoryValidator_1.default.validatorParams, registerCategoryValidator_1.default.validator, register_category_controller_1.default);
// GET /api/v2/categories - Get all categories
router.get('/', getAll_category_controller_1.default);
// GET /api/v2/categories/:id - Get specific category
router.get('/:id', getById_category_controller_1.default);
// PUT /api/v2/categories/:id - Update category
router.put('/:id', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), registerCategoryValidator_1.default.validatorParams, registerCategoryValidator_1.default.validator, update_category_controller_1.default);
// DELETE /api/v2/categories/:id - Delete category
router.delete('/:id', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), delete_category_controller_1.default);
exports.default = router;
