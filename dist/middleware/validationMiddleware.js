"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidationResponse = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
            value: error.value || undefined
        }));
        return res.status(422).json({
            success: false,
            message: 'Error de validación',
            errors: formattedErrors
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
const createValidationResponse = (field, message, value) => ({
    success: false,
    message: 'Error de validación',
    errors: [{
            field,
            message,
            value
        }]
});
exports.createValidationResponse = createValidationResponse;
