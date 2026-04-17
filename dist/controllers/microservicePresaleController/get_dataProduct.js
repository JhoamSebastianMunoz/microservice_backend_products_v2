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
let get_DataProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { ids } = req.query; // Extraer el parámetro 'ids' de la consulta
        console.log('IDS: ', ids);
        if (typeof ids !== 'string') {
            return res.status(400).json({ message: 'IDs must be a string' });
        }
        const idsArray = ids.split(',').map(id => parseInt(id, 10)); // Convertir el string de IDs en un array
        console.log('IDs Array:', idsArray);
        const products = yield MicroservicePresaleService_1.default.getDataProduct(idsArray); // Buscar productos por los IDs
        console.log('PRODUCTOS: ', products);
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the provided IDs' });
        }
        return res.status(200).json(products);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});
exports.default = get_DataProduct;
