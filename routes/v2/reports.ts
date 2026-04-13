import express from "express";
import getProductsLowStockController from '../../controllers/reportsController/getProductsLowStock';
import verifyToken from "../../middleware/verifyToken";
import checkRoleAndPermission from "../../middleware/checkRoleAndPermission";

const router = express.Router();

// GET /api/v2/reports/low-stock - Get low stock products report
router.get('/low-stock', 
    verifyToken, 
    checkRoleAndPermission(["ADMINISTRADOR"]), 
    getProductsLowStockController
);

export default router;
