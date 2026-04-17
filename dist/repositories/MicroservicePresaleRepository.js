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
const config_db_1 = __importDefault(require("../config/config-db"));
class MicroPresaleRepository {
    static getDataProduct(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            // Usar placeholders seguros para PostgreSQL
            const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
            const sql = `SELECT * FROM productos WHERE id_producto IN (${placeholders})`;
            const result = yield config_db_1.default.query(sql, ids);
            console.log('Rows from DB:', result.rows);
            return result.rows;
        });
    }
    // Funcion para actualiza la cantidad de productos
    static updateProductQuantity(id_producto, cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE productos SET cantidad_ingreso = $1 WHERE id_producto = $2 RETURNING *`;
            const result = yield config_db_1.default.query(sql, [cantidad, id_producto]);
            return result.rows.length > 0;
        });
    }
}
exports.default = MicroPresaleRepository;
