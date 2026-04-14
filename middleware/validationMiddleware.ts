import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

export interface ValidationErrorResponse {
    errors: Array<{
        field: string;
        message: string;
        value?: any;
    }>;
}

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const formattedErrors: ValidationErrorResponse['errors'] = errors.array().map((error: any) => ({
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

export const createValidationResponse = (field: string, message: string, value?: any) => ({
    success: false,
    message: 'Error de validación',
    errors: [{
        field,
        message,
        value
    }]
});
