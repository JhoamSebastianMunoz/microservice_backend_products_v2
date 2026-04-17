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
const ImageService_1 = __importDefault(require("../../services/ImageService"));
const deleteImageProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileName } = req.body;
        // Validar que fileName sea una cadena válida
        if (!fileName || typeof fileName !== "string" || fileName.trim() === "") {
            return res.status(400).json({ message: "El parámetro 'fileName' es obligatorio y debe ser una cadena válida." });
        }
        // Llamar al servicio para eliminar la imagen
        const result = yield ImageService_1.default.deleteImage({ fileName });
        return res.status(200).json({ message: `La imagen '${fileName}' se eliminó correctamente.` });
    }
    catch (error) {
        console.error("Error al eliminar la imagen:", error);
        return res.status(500).json({ message: "Error interno al eliminar la imagen." });
    }
});
exports.default = deleteImageProductController;
