"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const register_stock_1 = __importDefault(require("../../controllers/InventoryController/register-stock"));
const stockValidator_1 = __importDefault(require("../../middleware/productMiddleware/stockValidator"));
const router = express_1.default.Router();
router.post('/:id_producto', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), stockValidator_1.default.stockValidator, stockValidator_1.default.validarStock, register_stock_1.default);
exports.default = router;
