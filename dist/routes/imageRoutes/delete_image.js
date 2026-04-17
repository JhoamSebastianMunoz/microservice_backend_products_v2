"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deleteImageValidator_1 = __importDefault(require("../../middleware/imageMiddleware/deleteImageValidator"));
const delete_image_controller_1 = __importDefault(require("../../controllers/imageController/delete-image-controller"));
const router = express_1.default.Router();
// Ruta DELETE para eliminar imágenes
router.delete("/", deleteImageValidator_1.default.validatorParams, deleteImageValidator_1.default.validator, delete_image_controller_1.default);
exports.default = router;
