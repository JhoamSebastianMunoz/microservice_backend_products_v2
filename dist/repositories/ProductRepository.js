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
class ProductRepository {
    static add(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('productos')
                .insert([
                {
                    nombre_producto: product.nombre_producto,
                    precio: product.precio,
                    descripcion: product.descripcion,
                    cantidad_ingreso: product.cantidad_ingreso,
                    id_categoria: product.id_categoria
                }
            ])
                .select('*');
            if (error)
                throw error;
            return data[0];
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('productos')
                .select(`
                *,
                categorias(nombre_categoria)
            `);
            if (error)
                throw error;
            // Transformar los datos para que coincidan con la estructura esperada
            return data.map(product => {
                var _a;
                return (Object.assign(Object.assign({}, product), { nombre_categoria: ((_a = product.categorias) === null || _a === void 0 ? void 0 : _a.nombre_categoria) || null }));
            });
        });
    }
    static get(getProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { data, error } = yield config_supabaseStorage_1.default
                .from('productos')
                .select(`
                *,
                categorias(nombre_categoria)
            `)
                .eq('id_producto', getProduct.id)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return []; // No encontrado
                }
                throw error;
            }
            const transformedData = Object.assign(Object.assign({}, data), { nombre_categoria: ((_a = data.categorias) === null || _a === void 0 ? void 0 : _a.nombre_categoria) || null });
            return [transformedData];
        });
    }
    static delete(deleteProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('productos')
                .delete()
                .eq('id_producto', deleteProduct.id)
                .select('*');
            if (error)
                throw error;
            return data.length > 0; // Devuelve true si se eliminó, false si no.
        });
    }
    static update(updateProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('productos')
                .update({
                nombre_producto: updateProduct.nombre_producto,
                precio: updateProduct.precio,
                descripcion: updateProduct.descripcion,
                id_categoria: updateProduct.id_categoria
            })
                .eq('id_producto', updateProduct.id)
                .select('*');
            if (error)
                throw error;
            return data[0];
        });
    }
}
;
exports.default = ProductRepository;
