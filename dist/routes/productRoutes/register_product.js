"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registerProductValidator_1 = __importDefault(require("../../middleware/productMiddleware/registerProductValidator"));
const register_product_controller_1 = __importDefault(require("../../controllers/productController/register-product-controller"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const registerMultipleImagesValidator_1 = __importDefault(require("../../middleware/imageMiddleware/registerMultipleImagesValidator"));
const router = express_1.default.Router();
router.post('/', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), registerProductValidator_1.default.validatorParams, registerProductValidator_1.default.validator, registerMultipleImagesValidator_1.default, register_product_controller_1.default);
exports.default = router;
