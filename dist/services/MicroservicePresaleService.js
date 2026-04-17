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
const MicroservicePresaleRepository_1 = __importDefault(require("../repositories/MicroservicePresaleRepository"));
class MicroPresaleService {
    // Funcion para buscar nombre_producto, precio para el microservicio preventa
    static getDataProduct(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('IDs passed to repository:', ids); // Log de los IDs
            const rows = yield MicroservicePresaleRepository_1.default.getDataProduct(ids);
            console.log('Rows from DB:', rows); // Verifica lo que devuelve la base de datos
            if (rows.length === 0) {
                throw new Error(`Producto con IDs ${ids.join(', ')} no encontrado`);
            }
            return rows;
        });
    }
    // Funcion para actualizar la cantidad de productos
    static updateQuantity(id_producto, cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MicroservicePresaleRepository_1.default.updateProductQuantity(id_producto, cantidad);
        });
    }
}
exports.default = MicroPresaleService;
