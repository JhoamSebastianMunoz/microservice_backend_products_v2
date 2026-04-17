"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deleteProductValidator_1 = __importDefault(require("../../middleware/productMiddleware/deleteProductValidator"));
const delete_product_controller_1 = __importDefault(require("../../controllers/productController/delete-product-controller"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const router = express_1.default.Router();
router.delete('/:id_producto', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), deleteProductValidator_1.default.validatorParams, deleteProductValidator_1.default.validator, delete_product_controller_1.default);
exports.default = router;
