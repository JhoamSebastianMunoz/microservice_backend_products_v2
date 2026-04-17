"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conflictResponse = exports.notFoundResponse = exports.successResponse = exports.createApiError = exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
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
        });
    }
    if (error.code === 'ER_ROW_IS_REFERENCED') {
        return res.status(409).json({
            success: false,
            message: 'Conflicto de integridad',
            error: 'No se puede eliminar el registro debido a referencias existentes',
            details: error.sqlMessage
        });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(404).json({
            success: false,
            message: 'Registro no encontrado',
            error: 'La categoría especificada no existe'
        });
    }
    // Errores de validación (ya manejados por el middleware de validación)
    if (error.statusCode === 422) {
        return res.status(422).json({
            success: false,
            message: 'Error de validación',
            errors: error.errors
        });
    }
    // Error personalizado con statusCode
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            error: error.message,
            details: error.details
        });
    }
    // Error interno del servidor por defecto
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'Ha ocurrido un error inesperado',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};
exports.errorHandler = errorHandler;
const createApiError = (message, statusCode = 500, details) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.details = details;
    return error;
};
exports.createApiError = createApiError;
const successResponse = (data, message = 'Operación exitosa', statusCode = 200) => {
    return {
        success: true,
        message,
        data
    };
};
exports.successResponse = successResponse;
const notFoundResponse = (resource = 'Recurso') => {
    return {
        success: false,
        message: `${resource} no encontrado`,
        error: `${resource} no encontrado`
    };
};
exports.notFoundResponse = notFoundResponse;
const conflictResponse = (message, details) => {
    return {
        success: false,
        message,
        error: message,
        details
    };
};
exports.conflictResponse = conflictResponse;
