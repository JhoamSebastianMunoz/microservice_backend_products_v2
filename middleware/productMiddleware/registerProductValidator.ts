import { check, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";

let validatorParams = [
    check('nombre_producto').isLength({ min: 2, max: 120})
    .withMessage('Ingrese un nombre de producto entre 2 a 120 caracteres').bail(),
    check('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número válido mayor o igual a 0').bail(),
    check('descripcion').isLength({max:255}).withMessage('La descripción es opcional con hasta 255 caracteres permitidos').optional().bail(),
    check('cantidad_ingreso').isInt({ min: 0 }).withMessage('La cantidad de ingreso debe ser un número entero mayor o igual a 0').optional().bail(),
    check('id_categoria').isInt({ min: 1 }).withMessage('El ID de categoría debe ser un número entero positivo').optional().bail(),
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