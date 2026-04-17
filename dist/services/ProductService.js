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
const ProductRepository_1 = __importDefault(require("../repositories/ProductRepository"));
class ProductService {
    static register_product(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ProductRepository_1.default.add(Object.assign(Object.assign({}, product), { cantidad_ingreso: product.cantidad_ingreso || 0 }));
            return result;
        });
    }
    static getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductRepository_1.default.getAll();
        });
    }
    static getProduct(getProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductRepository_1.default.get(getProduct);
        });
    }
    static deleteProduct(deleteProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductRepository_1.default.delete(deleteProduct);
        });
    }
    static updateProduct(updateProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductRepository_1.default.update(updateProduct);
        });
    }
}
;
exports.default = ProductService;
