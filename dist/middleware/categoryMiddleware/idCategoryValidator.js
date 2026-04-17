"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
let validatorParams = [
    (0, express_validator_1.check)("id_categoria")
        .isNumeric()
        .withMessage("El ID de la categoría debe ser un número válido.")
        .bail()
        .notEmpty()
        .withMessage("El ID de la categoría es obligatorio.")
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
