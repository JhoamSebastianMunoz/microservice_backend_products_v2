import { check, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

let validatorParams = [
    check("nombre_categoria")
        .isLength({ min: 3, max: 100 })
        .withMessage("El nombre de la categoría debe tener entre 3 y 100 caracteres.")
        .bail()
        .matches(/^[\p{L}\s]+$/u)
        .withMessage("El nombre de la categoría solo puede contener letras y espacios.")
        .bail(),
    check("descripcion")
        .optional()
        .isLength({ min: 3, max: 255 })
        .withMessage("La descripción debe tener entre 3 y 255 caracteres.")
        .bail()
        .matches(/^[\p{L}\s]+$/u)
        .withMessage("La descripción solo puede contener letras y espacios.")
        .bail(),
];

function validator(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

export default {
    validatorParams,
    validator
};
