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
const RegisterImageDto_1 = __importDefault(require("../../Dto/imageDto/RegisterImageDto"));
const uploadImageProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const content = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
        const fileName = (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname;
        if (!fileName || !content) {
            return res.status(400).json({ message: "Error: Archivo no encontrado o inválido." });
        }
        const url = yield ImageService_1.default.registerImage(new RegisterImageDto_1.default(fileName, content));
        if (!url) {
            return res.status(400).json({ message: 'Error al subir la imagen' });
        }
        else {
            res.status(201).json({ message: "Imagen subida correctamente.", url });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error al subir la imagen." });
    }
});
exports.default = uploadImageProductController;
