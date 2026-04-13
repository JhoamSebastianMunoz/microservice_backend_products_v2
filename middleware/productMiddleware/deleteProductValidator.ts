import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

let validatorParams = [
    check('id').isInt({ min: 1 }).withMessage('El ID del producto debe ser un número entero positivo').bail()
];

function validator(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};

export default {
    validatorParams,
    validator
};
