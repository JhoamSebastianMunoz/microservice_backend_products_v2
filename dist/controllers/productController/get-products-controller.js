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
const ProductService_1 = __importDefault(require("../../services/ProductService"));
const errorHandler_1 = require("../../middleware/errorHandler");
let get_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield ProductService_1.default.getProducts();
        return res.status(200).json((0, errorHandler_1.successResponse)(result));
    }
    catch (error) {
        throw (0, errorHandler_1.createApiError)("Error al obtener productos", 500, error.message);
    }
});
exports.default = get_products;
