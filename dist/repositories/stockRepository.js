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
class StockRepository {
    static verificarProducto(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield config_db_1.default.query('SELECT * FROM productos WHERE id_producto = $1', [id_producto]);
            return result.rows.length > 0;
        });
    }
    ;
    static registrarStockDB(dataStock, id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            yield config_db_1.default.query('INSERT INTO registro_stock (id_producto, cantidad_ingresada, fecha_vencimiento, codigo_factura, costo_total, costo_unitario, porcentaje_venta, id_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [dataStock.id_producto, dataStock.cantidad_ingresada, dataStock.fecha_vencimiento, dataStock.codigo_factura, dataStock.costo_total, dataStock.costo_unitario, dataStock.porcentaje_venta, id_usuario]);
        });
    }
    ;
    static actualizarStockYPrecioDB(dataStock) {
        return __awaiter(this, void 0, void 0, function* () {
            // Calcular el nuevo precio del producto basado en el porcentaje de ganancia
            const nuevo_precio = dataStock.costo_unitario + (dataStock.costo_unitario * (dataStock.porcentaje_venta / 100));
            yield config_db_1.default.query(`
            UPDATE productos 
            SET cantidad_ingreso = cantidad_ingreso + $1, 
                precio = $2 
            WHERE id_producto = $3`, [dataStock.cantidad_ingresada, nuevo_precio, dataStock.id_producto]);
        });
    }
    ;
    static getStockHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield config_db_1.default.query(`
            SELECT rs.id_registro, rs.fecha_ingreso, rs.id_producto, p.nombre_producto, 
                   rs.cantidad_ingresada, rs.id_usuario
            FROM registro_stock rs
            JOIN productos p ON rs.id_producto = p.id_producto
            ORDER BY rs.fecha_ingreso DESC
        `);
            return result.rows;
        });
    }
    ;
    static obtenerDetalleIngreso(id_registro) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield config_db_1.default.query(`
            SELECT rs.id_registro, rs.codigo_factura, rs.fecha_vencimiento, rs.cantidad_ingresada AS cantidad_ingreso,
                   rs.costo_total, rs.costo_unitario, rs.porcentaje_venta, rs.id_producto, p.nombre_producto,
                   rs.cantidad_ingresada, rs.id_usuario
            FROM registro_stock rs
            JOIN productos p ON rs.id_producto = p.id_producto
            WHERE rs.id_registro = $1
        `, [id_registro]);
            return result.rows.length > 0 ? result.rows[0] : null;
        });
    }
    ;
}
;
exports.default = StockRepository;
