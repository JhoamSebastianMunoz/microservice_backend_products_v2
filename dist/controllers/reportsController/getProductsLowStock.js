"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReportsService_1 = __importDefault(require("../../services/ReportsService"));
let getProductsLowStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const umbral = parseInt(req.query.umbral) || 15;
        const result = yield ReportsService_1.default.get_productsLowStock(umbral);
        // Envía una sola respuesta
        if (result.length === 0) {
            return res.status(404).json({ message: "No hay productos con stock menor a " + umbral });
        }
        else {
            return res.status(200).json(result);
        }
    }
    catch (error) {
        console.error("Error al obtener productos con stock bajo:", error);
        return res.status(500).json({
            error: "Error interno del servidor",
            details: error.message
        });
    }
});
exports.default = getProductsLowStock;
