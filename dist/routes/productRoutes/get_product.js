"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getProductValidator_1 = __importDefault(require("../../middleware/productMiddleware/getProductValidator"));
const get_product_controller_1 = __importDefault(require("../../controllers/productController/get-product-controller"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const router = express_1.default.Router();
router.get('/:id_producto', verifyToken_1.default, getProductValidator_1.default.validatorParams, getProductValidator_1.default.validator, get_product_controller_1.default);
exports.default = router;
