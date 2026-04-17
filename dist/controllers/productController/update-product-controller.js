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
const ProductImageService_1 = __importDefault(require("../../services/ProductImageService"));
const errorHandler_1 = require("../../middleware/errorHandler");
let update_product = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombre_producto, precio, descripcion, id_categoria, primary_image_index, delete_images } = req.body;
        // Extraer archivos de imágenes del request
        const images = req.files || [];
        // Actualizar datos del producto
        const updateProductRequest = {
            id: parseInt(id),
            nombre_producto,
            precio,
            descripcion,
            id_categoria
        };
        const result = yield ProductService_1.default.updateProduct(updateProductRequest);
        if (!result || result.affectedRows === 0) {
            return res.status(404).json((0, errorHandler_1.notFoundResponse)('Producto'));
        }
        // Delegar procesamiento de imágenes al servicio
        const imageResults = yield ProductImageService_1.default.processProductImages(parseInt(id), images, delete_images, primary_image_index ? parseInt(primary_image_index) : undefined);
        return res.status(200).json((0, errorHandler_1.successResponse)({
            product_id: parseInt(id),
            images: imageResults
        }, 'Producto actualizado con éxito'));
    }
    catch (error) {
        throw (0, errorHandler_1.createApiError)(error.code === "ER_DUP_ENTRY" ? error.sqlMessage : "Error al actualizar producto", error.code === "ER_DUP_ENTRY" ? 409 : 500, error.message);
    }
});
exports.default = update_product;
