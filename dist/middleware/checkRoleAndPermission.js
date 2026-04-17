"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkRoleAndPermission = (roles, isOwnDataAllowed = false) => {
    return (req, res, next) => {
        // TEMPORALMENTE DESHABILITADO: Validación de roles para permitir acceso sin restricciones
        // Código original comentado para fácil reactivación futura
        /*
        const userRole = req.body.role; // Obtenido del payload del token
        const userId = req.body.cedula; // ID del colaborador (si es necesario verificar sus propios datos)

        if (!roles.includes(userRole)) {
            res.status(403).json({ error: "No tienes permisos para realizar esta acción" });
            return;
        }

        // Si `isOwnDataAllowed` es true, verifica que el colaborador solo acceda a sus propios datos
        if (isOwnDataAllowed && userRole === "COLABORADOR") {
            const idColaboradorFromRequest = req.body.cedula || req.params.cedula;

            if (idColaboradorFromRequest && userId !== idColaboradorFromRequest) {
                res.status(403).json({ error: "No puedes acceder a los datos de otro colaborador" });
                return;
            }
        }
        */
        // TEMPORAL: Permitir acceso a todos los roles sin validación
        console.log(`TEMPORAL: Acceso permitido sin validación de roles. Rol asignado: ${req.body.role}`);
        next();
    };
};
exports.default = checkRoleAndPermission;
