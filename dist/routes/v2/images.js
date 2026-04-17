"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_image_product_controller_1 = __importDefault(require("../../controllers/imageController/upload-image-product-controller"));
const get_image_controller_1 = __importDefault(require("../../controllers/imageController/get-image-controller"));
const delete_image_controller_1 = __importDefault(require("../../controllers/imageController/delete-image-controller"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const router = express_1.default.Router();
// POST /api/v2/images/upload - Upload image
router.post('/upload', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), upload_image_product_controller_1.default);
// GET /api/v2/images/:id - Get image
router.get('/:id', get_image_controller_1.default);
// DELETE /api/v2/images/:id - Delete image
router.delete('/:id', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), delete_image_controller_1.default);
exports.default = router;
