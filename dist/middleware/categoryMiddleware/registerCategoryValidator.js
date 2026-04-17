"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
let validatorParams = [
    (0, express_validator_1.check)("nombre_categoria")
        .isLength({ min: 3, max: 100 })
        .withMessage("El nombre de la categoría debe tener entre 3 y 100 caracteres.")
        .bail()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("El nombre de la categoría solo puede contener letras y espacios.")
        .bail(),
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
