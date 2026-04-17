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
let get_product = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getProductRequest = { id: parseInt(id) };
        const result = yield ProductService_1.default.getProduct(getProductRequest);
        if (result.length === 0) {
            return res.status(404).json((0, errorHandler_1.notFoundResponse)('Producto'));
        }
        else {
            return res.status(200).json((0, errorHandler_1.successResponse)(result));
        }
    }
    catch (error) {
        throw (0, errorHandler_1.createApiError)("Error al obtener producto", 500, error.message);
    }
});
exports.default = get_product;
