"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const idCategoryValidator_1 = __importDefault(require("../../middleware/categoryMiddleware/idCategoryValidator"));
const delete_category_controller_1 = __importDefault(require("../../controllers/categoryController/delete-category-controller"));
const router = express_1.default.Router();
router.delete('/:id_categoria', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), idCategoryValidator_1.default.validatorParams, idCategoryValidator_1.default.validator, delete_category_controller_1.default);
exports.default = router;
