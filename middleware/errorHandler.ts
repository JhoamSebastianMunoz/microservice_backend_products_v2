import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
    statusCode?: number;
    code?: string;
    details?: any;
    sqlMessage?: string;
    errors?: any;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
    details?: any;
    errors?: Array<{
        field: string;
        message: string;
        value?: any;
    }>;
    statusCode?: number;
}

export const errorHandler = (
    error: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        statusCode: error.statusCode,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });

    // Errores de base de datos conocidos
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            message: 'Conflicto de datos',
            error: 'El registro ya existe',
            details: error.sqlMessage
        } as ApiResponse);
    }

    if (error.code === 'ER_ROW_IS_REFERENCED') {
        return res.status(409).json({
            success: false,
            message: 'Conflicto de integridad',
            error: 'No se puede eliminar el registro debido a referencias existentes',
            details: error.sqlMessage
        } as ApiResponse);
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(404).json({
            success: false,
            message: 'Registro no encontrado',
            error: 'La categoría especificada no existe'
        } as ApiResponse);
    }

    // Errores de validación (ya manejados por el middleware de validación)
    if (error.statusCode === 422) {
        return res.status(422).json({
            success: false,
            message: 'Error de validación',
            errors: error.errors
        } as ApiResponse);
    }

    // Error personalizado con statusCode
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            error: error.message,
            details: error.details
        } as ApiResponse);
    }

    // Error interno del servidor por defecto
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'Ha ocurrido un error inesperado',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    } as ApiResponse);
};

export const createApiError = (message: string, statusCode: number = 500, details?: any): ApiError => {
    const error = new Error(message) as ApiError;
    error.statusCode = statusCode;
    error.details = details;
    return error;
};

export const successResponse = (data: any, message: string = 'Operación exitosa', statusCode: number = 200): ApiResponse => {
    return {
        success: true,
        message,
        data
    };
};

export const notFoundResponse = (resource: string = 'Recurso'): ApiResponse => {
    return {
        success: false,
        message: `${resource} no encontrado`,
        error: `${resource} no encontrado`
    };
};

export const conflictResponse = (message: string, details?: any): ApiResponse => {
    return {
        success: false,
        message,
        error: message,
        details
    };
};
