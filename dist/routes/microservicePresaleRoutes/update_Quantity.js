"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const update_Product_Quantity_1 = __importDefault(require("../../controllers/microservicePresaleController/update-Product-Quantity"));
const router = express_1.default.Router();
router.put('/products/actualizar-cantidad/:id_producto/:cantidad', update_Product_Quantity_1.default);
exports.default = router;
