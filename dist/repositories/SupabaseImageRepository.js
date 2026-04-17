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
const ImageUploadHelper_1 = __importDefault(require("../Helpers/ImageUploadHelper"));
class SupabaseImageRepository {
    static uploadToImage(registerImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!registerImage.fileName || !registerImage.content) {
                    throw new Error("El nombre del archivo o el contenido están vacíos.");
                }
                // Usar ImageUploadHelper con validaciones mejoradas
                const result = yield ImageUploadHelper_1.default.uploadProductImage(registerImage.content, registerImage.fileName);
                return result.url;
            }
            catch (error) {
                console.error("Error al subir la imagen:", error);
                throw error;
            }
        });
    }
    static generatePublicUrl(getImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = `productos/${getImage.fileName}`;
                // Usar ImageUploadHelper para generar URL pública
                return yield ImageUploadHelper_1.default.generatePublicUrl(filePath);
            }
            catch (error) {
                console.error("Error al generar URL pública:", error);
                throw error;
            }
        });
    }
    static deleteFile(deleteImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = `productos/${deleteImage.fileName}`;
                // Usar ImageUploadHelper para eliminar archivo
                yield ImageUploadHelper_1.default.deleteImage(filePath);
            }
            catch (error) {
                console.error("Error al eliminar la imagen:", error);
                throw error;
            }
        });
    }
}
exports.default = SupabaseImageRepository;
