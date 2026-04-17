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
let register_product = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre_producto, precio, descripcion, cantidad_ingreso, id_categoria, primary_image_index } = req.body;
        // Extraer archivos de imágenes del request
        const images = req.files || [];
        // Crear objeto de producto con la nueva interface
        const product = {
            nombre_producto,
            precio,
            descripcion,
            cantidad_ingreso,
            id_categoria
        };
        const result = yield ProductService_1.default.register_product(product);
        // Si el producto se creó exitosamente y hay imágenes, subirlas
        if (result && result.insertId && images.length > 0) {
            try {
                const uploadedImages = yield ProductImageService_1.default.uploadMultipleImages(result.insertId, images, primary_image_index ? parseInt(primary_image_index) : undefined);
                return res.status(201).json((0, errorHandler_1.successResponse)({
                    product_id: result.insertId,
                    images: uploadedImages
                }, 'Producto registrado con éxito', 201));
            }
            catch (imageError) {
                console.error('Error subiendo imágenes:', imageError);
                // El producto se creó pero las imágenes fallaron, retornar advertencia
                return res.status(201).json((0, errorHandler_1.successResponse)({
                    product_id: result.insertId,
                    image_error: imageError instanceof Error ? imageError.message : 'Error desconocido'
                }, 'Producto registrado con éxito, pero hubo errores al subir las imágenes', 201));
            }
        }
        return res.status(201).json((0, errorHandler_1.successResponse)({
            product_id: result === null || result === void 0 ? void 0 : result.insertId
        }, 'Producto registrado con éxito', 201));
    }
    catch (error) {
        throw (0, errorHandler_1.createApiError)(error.code === "ER_DUP_ENTRY" ? error.sqlMessage : "Error al registrar producto", error.code === "ER_DUP_ENTRY" ? 409 : 500, error.message);
    }
});
exports.default = register_product;
