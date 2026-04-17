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
const ProductImageRepository_1 = __importDefault(require("../repositories/ProductImageRepository"));
const ProductImageDto_1 = __importDefault(require("../Dto/productDto/ProductImageDto"));
const ImageService_1 = __importDefault(require("./ImageService"));
const RegisterImageDto_1 = __importDefault(require("../Dto/imageDto/RegisterImageDto"));
const DeleteImageDto_1 = __importDefault(require("../Dto/imageDto/DeleteImageDto"));
class ProductImageService {
    // Subir múltiples imágenes y asociarlas a un producto
    static uploadMultipleImages(productId, files, primaryImageIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!files || files.length === 0) {
                return [];
            }
            const uploadedImages = [];
            const errors = [];
            try {
                // Subir cada imagen a Supabase Storage
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    try {
                        // Validar que sea una imagen
                        if (!this.validateImageFile(file)) {
                            errors.push(`Archivo ${file.originalname} no es una imagen válida`);
                            continue;
                        }
                        // Subir imagen a Supabase
                        const registerImage = new RegisterImageDto_1.default(file.originalname, file.buffer);
                        const imageUrl = yield ImageService_1.default.registerImage(registerImage);
                        if (!imageUrl) {
                            errors.push(`Error al subir imagen ${file.originalname}`);
                            continue;
                        }
                        // Extraer storage path de la URL
                        const storagePath = this.extractStoragePathFromUrl(imageUrl);
                        // Determinar si es la imagen principal
                        const isPrimary = primaryImageIndex !== undefined && i === primaryImageIndex;
                        // Crear objeto ProductImage
                        const productImage = new ProductImageDto_1.default(productId, imageUrl, storagePath, isPrimary);
                        uploadedImages.push(productImage);
                    }
                    catch (error) {
                        console.error(`Error procesando archivo ${file.originalname}:`, error);
                        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                        errors.push(`Error procesando ${file.originalname}: ${errorMessage}`);
                    }
                }
                // Guardar en base de datos
                if (uploadedImages.length > 0) {
                    const savedImages = yield ProductImageRepository_1.default.createMultipleImages(uploadedImages);
                    if (errors.length > 0) {
                        console.warn('Algunas imágenes no se pudieron procesar:', errors);
                    }
                    return savedImages;
                }
                else {
                    throw new Error('No se pudo subir ninguna imagen. Errores: ' + errors.join(', '));
                }
            }
            catch (error) {
                console.error('Error en uploadMultipleImages:', error);
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                throw new Error(`Error al subir imágenes: ${errorMessage}`);
            }
        });
    }
    // Obtener todas las imágenes de un producto
    static getProductImages(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ProductImageRepository_1.default.getImagesByProductId(productId);
            }
            catch (error) {
                console.error('Error obteniendo imágenes del producto:', error);
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                throw new Error(`Error al obtener imágenes: ${errorMessage}`);
            }
        });
    }
    // Obtener imagen principal de un producto
    static getPrimaryImage(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ProductImageRepository_1.default.getPrimaryImageByProductId(productId);
            }
            catch (error) {
                console.error('Error obteniendo imagen principal:', error);
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                throw new Error(`Error al obtener imagen principal: ${errorMessage}`);
            }
        });
    }
    // Eliminar una imagen específica
    static deleteProductImage(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Primero obtener la imagen para saber el storage_path
                const images = yield ProductImageRepository_1.default.getImagesByProductId(0); // Esto no funcionará, necesitamos un método específico
                // Por ahora, eliminamos directamente de la base de datos
                const deleted = yield ProductImageRepository_1.default.deleteImage(imageId);
                if (!deleted) {
                    throw new Error('No se encontró la imagen para eliminar');
                }
                return true;
            }
            catch (error) {
                console.error('Error eliminando imagen del producto:', error);
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                throw new Error(`Error al eliminar imagen: ${errorMessage}`);
            }
        });
    }
    // Eliminar todas las imágenes de un producto
    static deleteAllProductImages(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener todas las imágenes para eliminarlas del storage
                const images = yield ProductImageRepository_1.default.getImagesByProductId(productId);
                // Eliminar cada imagen del storage
                for (const image of images) {
                    try {
                        const fileName = this.extractFileNameFromStoragePath(image.storage_path);
                        const deleteImage = new DeleteImageDto_1.default(fileName);
                        yield ImageService_1.default.deleteImage(deleteImage);
                    }
                    catch (error) {
                        console.warn(`Error eliminando imagen del storage: ${image.storage_path}`, error);
                    }
                }
                // Eliminar de la base de datos
                return yield ProductImageRepository_1.default.deleteAllImagesByProductId(productId);
            }
            catch (error) {
                console.error('Error eliminando todas las imágenes del producto:', error);
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                throw new Error(`Error al eliminar imágenes: ${errorMessage}`);
            }
        });
    }
    // Establecer imagen principal
    static setPrimaryImage(imageId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ProductImageRepository_1.default.setPrimaryImage(imageId, productId);
            }
            catch (error) {
                console.error('Error estableciendo imagen principal:', error);
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                throw new Error(`Error al establecer imagen principal: ${errorMessage}`);
            }
        });
    }
    // Procesar imágenes de producto (eliminar, subir nuevas, establecer principal)
    static processProductImages(productId, newImages, deleteImages, primaryImageIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const imageResults = {
                uploaded: [],
                deleted: [],
                errors: []
            };
            try {
                // Eliminar imágenes solicitadas
                if (deleteImages && Array.isArray(deleteImages)) {
                    for (const imageId of deleteImages) {
                        try {
                            yield this.deleteProductImage(parseInt(imageId));
                            imageResults.deleted.push(imageId);
                        }
                        catch (error) {
                            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                            imageResults.errors.push(`Error eliminando imagen ${imageId}: ${errorMessage}`);
                        }
                    }
                }
                // Subir nuevas imágenes
                if (newImages.length > 0) {
                    try {
                        const uploadedImages = yield this.uploadMultipleImages(productId, newImages, primaryImageIndex);
                        imageResults.uploaded = uploadedImages;
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                        imageResults.errors.push(`Error subiendo imágenes: ${errorMessage}`);
                    }
                }
                // Establecer imagen principal si se especificó y hay nuevas imágenes
                if (primaryImageIndex !== undefined && imageResults.uploaded.length > 0) {
                    const primaryImageId = (_a = imageResults.uploaded[primaryImageIndex]) === null || _a === void 0 ? void 0 : _a.id;
                    if (primaryImageId) {
                        try {
                            yield this.setPrimaryImage(primaryImageId, productId);
                        }
                        catch (error) {
                            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                            imageResults.errors.push(`Error estableciendo imagen principal: ${errorMessage}`);
                        }
                    }
                }
            }
            catch (error) {
                console.error('Error procesando imágenes:', error);
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                imageResults.errors.push(`Error general procesando imágenes: ${errorMessage}`);
            }
            return imageResults;
        });
    }
    // Validar que el archivo sea una imagen
    static validateImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        return allowedTypes.includes(file.mimetype) && file.size <= maxSize;
    }
    // Extraer storage_path de la URL de Supabase
    static extractStoragePathFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            return pathParts.slice(pathParts.indexOf('productos') + 1).join('/');
        }
        catch (error) {
            console.error('Error extrayendo storage path de URL:', error);
            return url;
        }
    }
    // Extraer nombre del archivo del storage_path
    static extractFileNameFromStoragePath(storagePath) {
        const parts = storagePath.split('/');
        return parts[parts.length - 1];
    }
}
exports.default = ProductImageService;
