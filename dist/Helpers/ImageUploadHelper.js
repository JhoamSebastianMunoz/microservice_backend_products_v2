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
const uuid_1 = require("uuid");
const config_supabaseStorage_1 = __importDefault(require("../config/config-supabaseStorage"));
class ImageUploadHelper {
    /**
     * Sube una imagen al bucket de Supabase Storage con validaciones mejoradas
     * @param file Buffer del archivo
     * @param originalName Nombre original del archivo
     * @param productId ID del producto (opcional, para organizar por producto)
     * @param options Opciones de configuración
     * @returns Promise<ImageUploadResult>
     */
    static uploadProductImage(file_1, originalName_1, productId_1) {
        return __awaiter(this, arguments, void 0, function* (file, originalName, productId, options = {}) {
            var _a;
            try {
                // Validaciones
                this.validateImageFile(file, originalName, options);
                // Configuración
                const maxSizeMB = options.maxSizeMB || this.DEFAULT_MAX_SIZE_MB;
                const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;
                const folder = options.folder || this.DEFAULT_FOLDER;
                // Determinar contentType
                const fileExtension = (_a = originalName.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                const contentType = this.getContentType(fileExtension);
                if (!allowedTypes.includes(contentType)) {
                    throw new Error(`Formato de archivo no permitido. Formatos permitidos: ${allowedTypes.join(', ')}`);
                }
                // Generar nombre único
                const uniqueFileName = `${(0, uuid_1.v4)()}.${fileExtension}`;
                const filePath = productId
                    ? `${folder}/${productId}/${uniqueFileName}`
                    : `${folder}/${uniqueFileName}`;
                // Obtener nombre del bucket
                const bucketName = process.env.SUPABASE_STORAGE_BUCKET;
                if (!bucketName) {
                    throw new Error("El nombre del bucket (SUPABASE_STORAGE_BUCKET) no está configurado");
                }
                // Subir archivo a Supabase Storage
                const { data, error } = yield config_supabaseStorage_1.default.storage
                    .from(bucketName)
                    .upload(filePath, file, {
                    contentType,
                    upsert: false
                });
                if (error) {
                    console.error("Error al subir imagen a Supabase:", error);
                    throw new Error(`No se pudo subir la imagen: ${error.message}`);
                }
                // Obtener URL pública
                const { data: { publicUrl } } = config_supabaseStorage_1.default.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);
                return {
                    url: publicUrl,
                    path: filePath,
                    fileName: uniqueFileName
                };
            }
            catch (error) {
                console.error("Error en ImageUploadHelper:", error);
                throw error;
            }
        });
    }
    /**
     * Elimina una imagen del storage
     * @param filePath Ruta del archivo en el storage
     */
    static deleteImage(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bucketName = process.env.SUPABASE_STORAGE_BUCKET;
                if (!bucketName) {
                    throw new Error("El nombre del bucket (SUPABASE_STORAGE_BUCKET) no está configurado");
                }
                const { error } = yield config_supabaseStorage_1.default.storage
                    .from(bucketName)
                    .remove([filePath]);
                if (error) {
                    console.error("Error al eliminar imagen de Supabase:", error);
                    throw new Error(`No se pudo eliminar la imagen: ${error.message}`);
                }
            }
            catch (error) {
                console.error("Error al eliminar la imagen:", error);
                throw error;
            }
        });
    }
    /**
     * Genera URL pública para una imagen existente
     * @param filePath Ruta del archivo en el storage
     * @returns URL pública
     */
    static generatePublicUrl(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bucketName = process.env.SUPABASE_STORAGE_BUCKET;
                if (!bucketName) {
                    throw new Error("El nombre del bucket (SUPABASE_STORAGE_BUCKET) no está configurado");
                }
                const { data: { publicUrl } } = config_supabaseStorage_1.default.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);
                return publicUrl;
            }
            catch (error) {
                console.error("Error al generar URL pública:", error);
                throw new Error("No se pudo generar la URL pública para la imagen.");
            }
        });
    }
    /**
     * Valida el archivo de imagen
     */
    static validateImageFile(file, originalName, options) {
        var _a;
        if (!file || !(file instanceof Buffer)) {
            throw new Error("El contenido del archivo es inválido.");
        }
        if (!originalName || typeof originalName !== 'string') {
            throw new Error("El nombre del archivo es obligatorio.");
        }
        const maxSizeMB = options.maxSizeMB || this.DEFAULT_MAX_SIZE_MB;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.length > maxSizeBytes) {
            throw new Error(`El archivo excede el tamaño máximo permitido de ${maxSizeMB}MB.`);
        }
        const fileExtension = (_a = originalName.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        if (!fileExtension || !validExtensions.includes(fileExtension)) {
            throw new Error(`Extensión de archivo no válida. Extensiones permitidas: ${validExtensions.join(', ')}`);
        }
    }
    /**
     * Obtiene el content type basado en la extensión del archivo
     */
    static getContentType(extension) {
        switch (extension) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'webp':
                return 'image/webp';
            default:
                return 'image/jpeg'; // Default
        }
    }
}
ImageUploadHelper.DEFAULT_MAX_SIZE_MB = 10;
ImageUploadHelper.DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
ImageUploadHelper.DEFAULT_FOLDER = 'productos';
exports.default = ImageUploadHelper;
