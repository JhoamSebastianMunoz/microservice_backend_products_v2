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
const config_supabaseStorage_1 = __importDefault(require("../config/config-supabaseStorage"));
class StockRepository {
    static verificarProducto(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('productos')
                .select('id_producto')
                .eq('id_producto', id_producto)
                .single();
            if (error && error.code !== 'PGRST116')
                throw error;
            return !!data;
        });
    }
    static registrarStockDB(dataStock, id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield config_supabaseStorage_1.default
                .from('registro_stock')
                .insert([{
                    id_producto: dataStock.id_producto,
                    cantidad_ingresada: dataStock.cantidad_ingresada,
                    fecha_vencimiento: dataStock.fecha_vencimiento,
                    codigo_factura: dataStock.codigo_factura,
                    costo_total: dataStock.costo_total,
                    costo_unitario: dataStock.costo_unitario,
                    porcentaje_venta: dataStock.porcentaje_venta,
                    id_usuario: id_usuario
                }]);
            if (error)
                throw error;
        });
    }
    static actualizarStockYPrecioDB(dataStock) {
        return __awaiter(this, void 0, void 0, function* () {
            // Calcular el nuevo precio del producto basado en el porcentaje de ganancia
            const nuevo_precio = dataStock.costo_unitario + (dataStock.costo_unitario * (dataStock.porcentaje_venta / 100));
            // Obtener cantidad actual primero
            const { data: producto, error: errorSelect } = yield config_supabaseStorage_1.default
                .from('productos')
                .select('cantidad_ingreso')
                .eq('id_producto', dataStock.id_producto)
                .single();
            if (errorSelect)
                throw errorSelect;
            const { error } = yield config_supabaseStorage_1.default
                .from('productos')
                .update({
                cantidad_ingreso: ((producto === null || producto === void 0 ? void 0 : producto.cantidad_ingreso) || 0) + dataStock.cantidad_ingresada,
                precio: nuevo_precio
            })
                .eq('id_producto', dataStock.id_producto);
            if (error)
                throw error;
        });
    }
    static getStockHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('registro_stock')
                .select(`
                id_registro,
                fecha_ingreso,
                id_producto,
                cantidad_ingresada,
                id_usuario,
                productos(nombre_producto)
            `)
                .order('fecha_ingreso', { ascending: false });
            if (error)
                throw error;
            // Transformar los datos para mantener compatibilidad
            return (data || []).map(row => {
                var _a;
                return ({
                    id_registro: row.id_registro,
                    fecha_ingreso: row.fecha_ingreso,
                    id_producto: row.id_producto,
                    cantidad_ingresada: row.cantidad_ingresada,
                    id_usuario: row.id_usuario,
                    nombre_producto: ((_a = row.productos) === null || _a === void 0 ? void 0 : _a.nombre_producto) || null
                });
            });
        });
    }
    static obtenerDetalleIngreso(id_registro) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { data, error } = yield config_supabaseStorage_1.default
                .from('registro_stock')
                .select(`
                id_registro,
                codigo_factura,
                fecha_vencimiento,
                cantidad_ingresada,
                costo_total,
                costo_unitario,
                porcentaje_venta,
                id_producto,
                id_usuario,
                productos(nombre_producto)
            `)
                .eq('id_registro', id_registro)
                .single();
            if (error) {
                if (error.code === 'PGRST116')
                    return null;
                throw error;
            }
            // Transformar los datos para mantener compatibilidad
            return {
                id_registro: data.id_registro,
                codigo_factura: data.codigo_factura,
                fecha_vencimiento: data.fecha_vencimiento,
                cantidad_ingreso: data.cantidad_ingresada,
                cantidad_ingresada: data.cantidad_ingresada,
                costo_total: data.costo_total,
                costo_unitario: data.costo_unitario,
                porcentaje_venta: data.porcentaje_venta,
                id_producto: data.id_producto,
                id_usuario: data.id_usuario,
                nombre_producto: ((_a = data.productos) === null || _a === void 0 ? void 0 : _a.nombre_producto) || null
            };
        });
    }
}
exports.default = StockRepository;
