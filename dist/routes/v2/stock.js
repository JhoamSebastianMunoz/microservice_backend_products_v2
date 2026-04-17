"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_stock_1 = __importDefault(require("../../controllers/InventoryController/register-stock"));
const get__historicalStockCrontroller_1 = __importDefault(require("../../controllers/InventoryController/get- historicalStockCrontroller"));
const get_Stock_1 = __importDefault(require("../../controllers/InventoryController/get-Stock"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const router = express_1.default.Router();
// POST /api/v2/stock/:productId - Update stock for specific product
router.post('/:productId', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), register_stock_1.default);
// GET /api/v2/stock/:productId - Get stock for specific product
router.get('/:productId', get_Stock_1.default);
// GET /api/v2/stock/history - Get stock history
router.get('/history', get__historicalStockCrontroller_1.default);
exports.default = router;
