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
const ImageUploadHelper_1 = __importDefault(require("../../Helpers/ImageUploadHelper"));
const ProductImageRepository_1 = __importDefault(require("../../repositories/ProductImageRepository"));
const ProductImageDto_1 = __importDefault(require("../../Dto/productDto/ProductImageDto"));
const uploadProductImageEnhancedController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { product_id, is_primary } = req.body;
        const file = req.file;
        // Validaciones básicas
        if (!file) {
            return res.status(400).json({
                message: "Error: No se proporcionó ningún archivo."
            });
        }
        if (!product_id) {
            return res.status(400).json({
                message: "Error: El ID del producto es obligatorio."
            });
        }
        const productId = parseInt(product_id);
        if (isNaN(productId)) {
            return res.status(400).json({
                message: "Error: El ID del producto debe ser un número válido."
            });
        }
        // Subir imagen a Supabase Storage usando ImageUploadHelper
        const uploadResult = yield ImageUploadHelper_1.default.uploadProductImage(file.buffer, file.originalname, product_id, {
            maxSizeMB: 10, // 10MB máximo
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
            folder: 'productos'
        });
        // Determinar si es imagen principal
        const isPrimaryImage = is_primary === 'true' || is_primary === '1';
        // Si se marca como principal, primero quitar el estado principal a las demás imágenes
        if (isPrimaryImage) {
            yield ProductImageRepository_1.default.setPrimaryImage(-1, productId); // Reinicia todas a false
        }
        // Guardar en la base de datos
        const productImage = new ProductImageDto_1.default(productId, uploadResult.url, uploadResult.path, isPrimaryImage);
        const savedImages = yield ProductImageRepository_1.default.createMultipleImages([productImage]);
        // Si se marcó como principal, establecer esta como imagen principal
        if (isPrimaryImage && savedImages.length > 0) {
            yield ProductImageRepository_1.default.setPrimaryImage(savedImages[0].id, productId);
        }
        res.status(201).json({
            message: "Imagen subida correctamente.",
            data: {
                id: (_a = savedImages[0]) === null || _a === void 0 ? void 0 : _a.id,
                product_id: productId,
                image_url: uploadResult.url,
                storage_path: uploadResult.path,
                is_primary: isPrimaryImage,
                created_at: (_b = savedImages[0]) === null || _b === void 0 ? void 0 : _b.created_at
            }
        });
    }
    catch (error) {
        console.error("Error al subir imagen de producto:", error);
        // Manejar diferentes tipos de errores
        if (error instanceof Error) {
            if (error.message.includes('tamaño máximo')) {
                return res.status(413).json({ message: error.message });
            }
            if (error.message.includes('Formato de archivo no permitido')) {
                return res.status(415).json({ message: error.message });
            }
            if (error.message.includes('Extensión de archivo no válida')) {
                return res.status(415).json({ message: error.message });
            }
        }
        res.status(500).json({
            message: "Error al subir la imagen de producto.",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});
exports.default = uploadProductImageEnhancedController;
