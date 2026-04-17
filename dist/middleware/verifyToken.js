"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // TEMPORALMENTE DESHABILITADO: Validación JWT para permitir acceso sin autenticación
    // Código original comentado para fácil reactivación futura
    /*
    let authorization = req.get('Authorization');
    if (authorization) {
        const token = authorization.split(' ')[1];
        
        if (!token) {
            res.status(401).json({
                status: 'No ha enviado un token'
            });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            
            req.body.cedula = decoded.cedula;
            req.body.role = decoded.role;
            req.body.contraseña = decoded.contraseña;
            req.body.id_usuario = decoded.id_usuario;

            next();
        } catch (error) {
            res.status(403).json({
                status: 'No autorizado',
                error: (error as Error).message
            });
            return;
        }
    } else {
        res.status(401).json({
            status: "token inválido o expirado"
        });
        return;
    }
    */
    // TEMPORAL: Permitir acceso sin validación de token
    // Asignar valores por defecto para compatibilidad con otros middleware
    req.body.cedula = "temp_user";
    req.body.role = "ADMINISTRADOR"; // Rol con permisos máximos para testing
    req.body.contraseña = "temp_password";
    req.body.id_usuario = 1;
    next();
});
exports.default = verifyToken;
