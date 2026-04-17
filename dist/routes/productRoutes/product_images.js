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
const express_1 = __importDefault(require("express"));
const ProductImageService_1 = __importDefault(require("../../services/ProductImageService"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const router = express_1.default.Router();
// Obtener todas las imágenes de un producto
router.get('/:product_id/images', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id } = req.params;
        const images = yield ProductImageService_1.default.getProductImages(parseInt(product_id));
        res.status(200).json({ images });
    }
    catch (error) {
        console.error('Error obteniendo imágenes del producto:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: "Error al obtener imágenes", details: errorMessage });
    }
}));
// Obtener imagen principal de un producto
router.get('/:product_id/images/primary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id } = req.params;
        const image = yield ProductImageService_1.default.getPrimaryImage(parseInt(product_id));
        if (!image) {
            return res.status(404).json({ error: "No se encontró imagen principal para este producto" });
        }
        res.status(200).json({ image });
    }
    catch (error) {
        console.error('Error obteniendo imagen principal:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: "Error al obtener imagen principal", details: errorMessage });
    }
}));
// Establecer imagen principal
router.put('/:product_id/images/:image_id/set-primary', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id, image_id } = req.params;
        const success = yield ProductImageService_1.default.setPrimaryImage(parseInt(image_id), parseInt(product_id));
        if (!success) {
            return res.status(404).json({ error: "No se encontró la imagen o el producto" });
        }
        res.status(200).json({ status: 'Imagen principal establecida con éxito' });
    }
    catch (error) {
        console.error('Error estableciendo imagen principal:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: "Error al establecer imagen principal", details: errorMessage });
    }
}));
// Eliminar una imagen específica
router.delete('/:product_id/images/:image_id', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { image_id } = req.params;
        const success = yield ProductImageService_1.default.deleteProductImage(parseInt(image_id));
        if (!success) {
            return res.status(404).json({ error: "No se encontró la imagen" });
        }
        res.status(200).json({ status: 'Imagen eliminada con éxito' });
    }
    catch (error) {
        console.error('Error eliminando imagen:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: "Error al eliminar imagen", details: errorMessage });
    }
}));
// Eliminar todas las imágenes de un producto
router.delete('/:product_id/images', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product_id } = req.params;
        const success = yield ProductImageService_1.default.deleteAllProductImages(parseInt(product_id));
        if (!success) {
            return res.status(404).json({ error: "No se encontraron imágenes para este producto" });
        }
        res.status(200).json({ status: 'Todas las imágenes eliminadas con éxito' });
    }
    catch (error) {
        console.error('Error eliminando imágenes del producto:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ error: "Error al eliminar imágenes", details: errorMessage });
    }
}));
exports.default = router;
