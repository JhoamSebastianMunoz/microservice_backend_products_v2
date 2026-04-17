"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_dataProduct_1 = __importDefault(require("../../controllers/microservicePresaleController/get_dataProduct"));
const router = express_1.default.Router();
router.get('/products', get_dataProduct_1.default);
exports.default = router;
