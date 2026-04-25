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
class MicroPresaleRepository {
    static getDataProduct(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('productos')
                .select('*')
                .in('id_producto', ids);
            if (error)
                throw error;
            return data;
        });
    }
    static updateProductQuantity(id_producto, cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('productos')
                .update({ cantidad_ingreso: cantidad })
                .eq('id_producto', id_producto)
                .select('*');
            if (error)
                throw error;
            return data.length > 0;
        });
    }
}
exports.default = MicroPresaleRepository;
