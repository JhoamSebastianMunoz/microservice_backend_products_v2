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
class CategoriaRepository {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('categorias')
                .select('*');
            if (error)
                throw error;
            return data;
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('categorias')
                .select('*')
                .eq('id_categoria', id)
                .single();
            if (error) {
                if (error.code === 'PGRST116')
                    return null;
                throw error;
            }
            return data;
        });
    }
    static add(categoria) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertData = { nombre_categoria: categoria.nombre_categoria };
            if (categoria.descripcion) {
                insertData.descripcion = categoria.descripcion;
            }
            const { data, error } = yield config_supabaseStorage_1.default
                .from('categorias')
                .insert([insertData])
                .select('*');
            if (error)
                throw error;
            return data[0];
        });
    }
    static update(id, categoria) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = { nombre_categoria: categoria.nombre_categoria };
            if (categoria.descripcion) {
                updateData.descripcion = categoria.descripcion;
            }
            const { data, error } = yield config_supabaseStorage_1.default
                .from('categorias')
                .update(updateData)
                .eq('id_categoria', id)
                .select('*');
            if (error)
                throw error;
            return data.length > 0;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('categorias')
                .delete()
                .eq('id_categoria', id)
                .select('*');
            if (error)
                throw error;
            return data.length > 0;
        });
    }
}
exports.default = CategoriaRepository;
