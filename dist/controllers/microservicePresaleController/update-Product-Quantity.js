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
const MicroservicePresaleService_1 = __importDefault(require("../../services/MicroservicePresaleService"));
const updateProductQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_producto } = req.params;
        const { cantidad } = req.params;
        console.log('CANTIDAdddD', cantidad);
        if (Number(cantidad) < 0) {
            return res.status(400).json({ error: 'La cantidad no puede ser negativa' });
        }
        const updated = yield MicroservicePresaleService_1.default.updateQuantity(Number(id_producto), Number(cantidad));
        if (!updated) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Cantidad actualizada correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
});
exports.default = updateProductQuantity;
