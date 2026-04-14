import { check } from 'express-validator';

// Validador para crear producto
export const createProductValidator = [
    check('nombre_producto')
        .isLength({ min: 2, max: 120 })
        .withMessage('El nombre del producto debe tener entre 2 y 120 caracteres')
        .trim()
        .escape(),
    
    check('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número válido mayor o igual a 0')
        .toFloat(),
    
    check('descripcion')
        .isLength({ max: 255 })
        .withMessage('La descripción no puede exceder 255 caracteres')
        .optional()
        .trim()
        .escape(),
    
    check('cantidad_ingreso')
        .isInt({ min: 0 })
        .withMessage('La cantidad de ingreso debe ser un número entero mayor o igual a 0')
        .optional()
        .toInt(),
    
    check('id_categoria')
        .isInt({ min: 1 })
        .withMessage('El ID de categoría debe ser un número entero positivo')
        .optional()
        .toInt()
];

// Validador para obtener producto por ID
export const getProductValidator = [
    check('id')
        .isInt({ min: 1 })
        .withMessage('El ID del producto debe ser un número entero positivo')
        .toInt()
];

// Validador para actualizar producto
export const updateProductValidator = [
    check('id')
        .isInt({ min: 1 })
        .withMessage('El ID del producto debe ser un número entero positivo')
        .toInt(),
    
    check('nombre_producto')
        .isLength({ min: 2, max: 120 })
        .withMessage('El nombre del producto debe tener entre 2 y 120 caracteres')
        .optional()
        .trim()
        .escape(),
    
    check('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número válido mayor o igual a 0')
        .optional()
        .toFloat(),
    
    check('descripcion')
        .isLength({ max: 255 })
        .withMessage('La descripción no puede exceder 255 caracteres')
        .optional()
        .trim()
        .escape(),
    
    check('id_categoria')
        .isInt({ min: 1 })
        .withMessage('El ID de categoría debe ser un número entero positivo')
        .optional()
        .toInt()
];

// Validador para eliminar producto
export const deleteProductValidator = [
    check('id')
        .isInt({ min: 1 })
        .withMessage('El ID del producto debe ser un número entero positivo')
        .toInt()
];
