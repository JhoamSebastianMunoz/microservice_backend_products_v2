"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getProductsLowStock_1 = __importDefault(require("../../controllers/reportsController/getProductsLowStock"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const router = express_1.default.Router();
// GET /api/v2/reports/low-stock - Get low stock products report
router.get('/low-stock', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), getProductsLowStock_1.default);
exports.default = router;
