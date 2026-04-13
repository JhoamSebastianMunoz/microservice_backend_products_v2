import express from "express";
import registerStockController from '../../controllers/InventoryController/register-stock';
import getHistoricalStockController from '../../controllers/InventoryController/get- historicalStockCrontroller';
import getStockController from '../../controllers/InventoryController/get-Stock';
import verifyToken from "../../middleware/verifyToken";
import checkRoleAndPermission from "../../middleware/checkRoleAndPermission";

const router = express.Router();

// POST /api/v2/stock/:productId - Update stock for specific product
router.post('/:productId', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    registerStockController
);

// GET /api/v2/stock/:productId - Get stock for specific product
router.get('/:productId', getStockController);

// GET /api/v2/stock/history - Get stock history
router.get('/history', getHistoricalStockController);

export default router;
