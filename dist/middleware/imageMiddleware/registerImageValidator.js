"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({
    limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB
});
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jfif", "image/webp"];
function uploadMiddleware(req, res, next) {
    upload.single("image")(req, res, (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({ message: "El archivo es demasiado grande. Máximo 6MB." });
            }
            return res.status(500).json({ message: "Error al procesar la imagen", error: err.message });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No se proporcionó ninguna imagen." });
        }
        // Validar formato de archivo
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return res.status(400).json({ message: "Formato de archivo no permitido." });
        }
        next();
    });
}
;
exports.default = uploadMiddleware;
