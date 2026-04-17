"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productValidators_1 = require("../../middleware/productValidators");
const validationMiddleware_1 = require("../../middleware/validationMiddleware");
const errorHandler_1 = require("../../middleware/errorHandler");
const register_product_controller_1 = __importDefault(require("../../controllers/productController/register-product-controller"));
const get_products_controller_1 = __importDefault(require("../../controllers/productController/get-products-controller"));
const get_product_controller_1 = __importDefault(require("../../controllers/productController/get-product-controller"));
const update_product_controller_1 = __importDefault(require("../../controllers/productController/update-product-controller"));
const delete_product_controller_1 = __importDefault(require("../../controllers/productController/delete-product-controller"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const registerMultipleImagesValidator_1 = __importDefault(require("../../middleware/imageMiddleware/registerMultipleImagesValidator"));
const router = express_1.default.Router();
// POST /api/v2/products - Create new product
router.post('/', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), productValidators_1.createProductValidator, validationMiddleware_1.handleValidationErrors, registerMultipleImagesValidator_1.default, register_product_controller_1.default);
// GET /api/v2/products - Get all products
router.get('/', get_products_controller_1.default);
// GET /api/v2/products/:id - Get specific product
router.get('/:id', productValidators_1.getProductValidator, validationMiddleware_1.handleValidationErrors, get_product_controller_1.default);
// PUT /api/v2/products/:id - Update product
router.put('/:id', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), productValidators_1.updateProductValidator, validationMiddleware_1.handleValidationErrors, update_product_controller_1.default);
// DELETE /api/v2/products/:id - Delete product
router.delete('/:id', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), productValidators_1.deleteProductValidator, validationMiddleware_1.handleValidationErrors, delete_product_controller_1.default);
// Aplicar manejador de errores centralizado a todas las rutas
router.use(errorHandler_1.errorHandler);
exports.default = router;
