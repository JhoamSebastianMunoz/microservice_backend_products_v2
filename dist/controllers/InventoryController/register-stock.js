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
const stockService_1 = __importDefault(require("../../services/stockService"));
const StockDto_1 = __importDefault(require("../../Dto/productDto/StockDto"));
let register_stock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_producto } = req.params;
    const { cantidad_ingresada, fecha_vencimiento, codigo_factura, costo_total, costo_unitario, porcentaje_venta } = req.body;
    const id_usuario = req.body.id_usuario;
    if (!cantidad_ingresada || !codigo_factura || !costo_total || !costo_unitario || !porcentaje_venta || !id_usuario) {
        return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    try {
        yield stockService_1.default.registrarStockService(new StockDto_1.default(Number(id_producto), cantidad_ingresada, fecha_vencimiento, codigo_factura, costo_total, costo_unitario, porcentaje_venta), id_usuario);
        res.status(201).json({ message: "Stock registrado con éxito" });
    }
    catch (error) {
        console.error("Error al registrar stock:", error);
        res.status(error.status || 500).json({ message: error.message || "Error interno del servidor" });
    }
});
exports.default = register_stock;
