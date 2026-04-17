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
const CategoriaRepository_1 = __importDefault(require("../repositories/CategoriaRepository"));
class CategoriaService {
    static getAllCategorias() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CategoriaRepository_1.default.getAll();
        });
    }
    static getCategoriaById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CategoriaRepository_1.default.getById(id);
        });
    }
    static createCategoria(categoria) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CategoriaRepository_1.default.add(categoria);
        });
    }
    static updateCategoria(categoria, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CategoriaRepository_1.default.update(id, categoria);
        });
    }
    static deleteCategoria(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CategoriaRepository_1.default.delete(id);
        });
    }
}
exports.default = CategoriaService;
