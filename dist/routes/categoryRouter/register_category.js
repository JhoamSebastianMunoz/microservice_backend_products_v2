"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const checkRoleAndPermission_1 = __importDefault(require("../../middleware/checkRoleAndPermission"));
const registerCategoryValidator_1 = __importDefault(require("../../middleware/categoryMiddleware/registerCategoryValidator"));
const register_category_controller_1 = __importDefault(require("../../controllers/categoryController/register-category-controller"));
const router = express_1.default.Router();
router.post('/', verifyToken_1.default, (0, checkRoleAndPermission_1.default)(["ADMINISTRADOR"]), registerCategoryValidator_1.default.validatorParams, registerCategoryValidator_1.default.validator, register_category_controller_1.default);
exports.default = router;
