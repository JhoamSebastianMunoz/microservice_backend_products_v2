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
const GetImageDto_1 = __importDefault(require("../../Dto/imageDto/GetImageDto"));
const ImageService_1 = __importDefault(require("../../services/ImageService"));
const getImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName } = req.params;
    if (!fileName) {
        return res.status(400).json({ message: "El nombre de la imagen es requerido." });
    }
    try {
        const imageUrl = yield ImageService_1.default.getImage(new GetImageDto_1.default(fileName));
        res.status(200).json({ message: "Imagen obtenida correctamente.", url: imageUrl });
    }
    catch (error) {
        console.error("Error al obtener la imagen:", error);
        res.status(500).json({ message: "No se pudo obtener la imagen." });
    }
});
exports.default = getImageController;
