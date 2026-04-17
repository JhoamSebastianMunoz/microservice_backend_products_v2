"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const updateProductValidator_1 = __importDefault(require("../../middleware/productMiddleware/updateProductValidator"));
const update_product_controller_1 = __importDefault(require("../../controllers/productController/update-product-controller"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const registerMultipleImagesValidator_1 = __importDefault(require("../../middleware/imageMiddleware/registerMultipleImagesValidator"));
const router = express_1.default.Router();
router.put('/:id_producto', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), updateProductValidator_1.default.validatorParams, updateProductValidator_1.default.validator, registerMultipleImagesValidator_1.default, update_product_controller_1.default);
exports.default = router;
