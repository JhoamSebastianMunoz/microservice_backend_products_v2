"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductValidator = exports.updateProductValidator = exports.getProductValidator = exports.createProductValidator = void 0;
const express_validator_1 = require("express-validator");
// Validador para crear producto
exports.createProductValidator = [
    (0, express_validator_1.check)('nombre_producto')
        .isLength({ min: 2, max: 120 })
        .withMessage('El nombre del producto debe tener entre 2 y 120 caracteres')
        .trim()
        .escape(),
    (0, express_validator_1.check)('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número válido mayor o igual a 0')
        .toFloat(),
    (0, express_validator_1.check)('descripcion')
        .isLength({ max: 255 })
        .withMessage('La descripción no puede exceder 255 caracteres')
        .optional()
        .trim()
        .escape(),
    (0, express_validator_1.check)('cantidad_ingreso')
        .isInt({ min: 0 })
        .withMessage('La cantidad de ingreso debe ser un número entero mayor o igual a 0')
        .optional()
        .toInt(),
    (0, express_validator_1.check)('id_categoria')
        .isInt({ min: 1 })
        .withMessage('El ID de categoría debe ser un número entero positivo')
        .optional()
        .toInt()
];
// Validador para obtener producto por ID
exports.getProductValidator = [
    (0, express_validator_1.check)('id')
        .isInt({ min: 1 })
        .withMessage('El ID del producto debe ser un número entero positivo')
        .toInt()
];
// Validador para actualizar producto
exports.updateProductValidator = [
    (0, express_validator_1.check)('id')
        .isInt({ min: 1 })
        .withMessage('El ID del producto debe ser un número entero positivo')
        .toInt(),
    (0, express_validator_1.check)('nombre_producto')
        .isLength({ min: 2, max: 120 })
        .withMessage('El nombre del producto debe tener entre 2 y 120 caracteres')
        .optional()
        .trim()
        .escape(),
    (0, express_validator_1.check)('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número válido mayor o igual a 0')
        .optional()
        .toFloat(),
    (0, express_validator_1.check)('descripcion')
        .isLength({ max: 255 })
        .withMessage('La descripción no puede exceder 255 caracteres')
        .optional()
        .trim()
        .escape(),
    (0, express_validator_1.check)('id_categoria')
        .isInt({ min: 1 })
        .withMessage('El ID de categoría debe ser un número entero positivo')
        .optional()
        .toInt()
];
// Validador para eliminar producto
exports.deleteProductValidator = [
    (0, express_validator_1.check)('id')
        .isInt({ min: 1 })
        .withMessage('El ID del producto debe ser un número entero positivo')
        .toInt()
];
