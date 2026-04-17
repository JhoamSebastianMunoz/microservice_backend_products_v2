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
class CategoriaRepository {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = 'SELECT * FROM categorias';
            const result = yield config_db_1.default.query(sql);
            return result.rows;
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = 'SELECT * FROM categorias WHERE id_categoria = $1';
            const result = yield config_db_1.default.query(sql, [id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        });
    }
    static add(categoria) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = 'INSERT INTO categorias (nombre_categoria) VALUES ($1) RETURNING *';
            const values = [categoria.nombre_categoria];
            const result = yield config_db_1.default.query(sql, values);
            return result.rows[0];
        });
    }
    static update(id, categoria) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = 'UPDATE categorias SET nombre_categoria = $1 WHERE id_categoria = $2 RETURNING *';
            const values = [categoria.nombre_categoria, id];
            const result = yield config_db_1.default.query(sql, values);
            return result.rows.length > 0;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = 'DELETE FROM categorias WHERE id_categoria = $1 RETURNING *';
            const result = yield config_db_1.default.query(sql, [id]);
            return result.rows.length > 0;
        });
    }
}
exports.default = CategoriaRepository;
