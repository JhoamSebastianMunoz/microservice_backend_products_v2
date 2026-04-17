"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getImageValidator_1 = __importDefault(require("../../middleware/imageMiddleware/getImageValidator"));
const get_image_controller_1 = __importDefault(require("../../controllers/imageController/get-image-controller"));
const router = express_1.default.Router();
// Endpoint para obtener una imagen por su nombre
router.get("/:fileName", getImageValidator_1.default.validatorParams, getImageValidator_1.default.validator, get_image_controller_1.default);
exports.default = router;
