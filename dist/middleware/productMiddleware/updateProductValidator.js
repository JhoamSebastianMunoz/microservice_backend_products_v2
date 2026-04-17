"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
let validatorParams = [
    (0, express_validator_1.check)('id').isInt({ min: 1 }).withMessage('El ID del producto debe ser un número entero positivo').bail(),
    (0, express_validator_1.check)('nombre_producto').isLength({ min: 2, max: 120 })
        .withMessage('Ingrese un nombre de producto entre 2 a 120 caracteres').optional().bail(),
    (0, express_validator_1.check)('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número válido mayor o igual a 0').optional().bail(),
    (0, express_validator_1.check)('descripcion').isLength({ max: 255 }).withMessage('La descripción es opcional con hasta 255 caracteres permitidos').optional().bail(),
    (0, express_validator_1.check)('id_categoria').isInt({ min: 1 }).withMessage('El ID de categoría debe ser un número entero positivo').optional().bail(),
];
function validator(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}
exports.default = {
    validatorParams,
    validator
};
