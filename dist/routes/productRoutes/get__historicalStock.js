"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const get__historicalStockCrontroller_1 = __importDefault(require("../../controllers/InventoryController/get- historicalStockCrontroller"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const router = express_1.default.Router();
router.get('/', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), get__historicalStockCrontroller_1.default);
exports.default = router;
