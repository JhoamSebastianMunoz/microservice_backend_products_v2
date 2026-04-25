"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({
    limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB por archivo
});
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jfif", "image/webp"];
function uploadMultipleImagesMiddleware(req, res, next) {
    upload.array("images", 5)(req, res, (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({
                    message: "Uno o más archivos son demasiado grandes. Máximo 6MB por archivo."
                });
            }
            if (err.code === "LIMIT_FILE_COUNT") {
                return res.status(413).json({
                    message: "Demasiados archivos. Máximo 5 imágenes permitidas."
                });
            }
            return res.status(500).json({ message: "Error al procesar las imágenes", error: err.message });
        }
        const files = req.files;
        // Las imágenes son opcionales - si no hay archivos, continuar
        if (!files || files.length === 0) {
            return next();
        }
        // Validar formato de cada archivo
        const invalidFiles = files.filter(file => !allowedMimeTypes.includes(file.mimetype));
        if (invalidFiles.length > 0) {
            const invalidNames = invalidFiles.map(file => file.originalname).join(", ");
            return res.status(400).json({
                message: "Formatos de archivo no permitidos.",
                invalid_files: invalidNames,
                allowed_formats: allowedMimeTypes
            });
        }
        next();
    });
}
;
exports.default = uploadMultipleImagesMiddleware;
