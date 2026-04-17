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
const stockRepository_1 = __importDefault(require("../repositories/stockRepository"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class StockService {
    static registrarStockService(dataStock, id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validar si el producto existe
            const productoExiste = yield stockRepository_1.default.verificarProducto(dataStock.id_producto);
            if (!productoExiste) {
                throw { status: 404, message: "Producto no encontrado" };
            }
            // TEMPORALMENTE DESHABILITADO: Consultar microservicio de usuarios para validar el usuario y su rol
            // Código original comentado para fácil reactivación futura
            /*
            const response = await axios.get(`${process.env.USUARIOS_SERVICE_URL}${id_usuario}`);
            const usuario = response.data;
            
            if (!usuario) {
                throw { status: 403, message: "Usuario no encontrado" };
            }
            */
            // TEMPORAL: Omitir validación de usuario y continuar con el registro
            console.log(`TEMPORAL: Omitiendo validación de usuario ${id_usuario} - Registro permitido`);
            // Registrar stock y actualizar cantidad en productos
            yield stockRepository_1.default.registrarStockDB(dataStock, id_usuario);
            yield stockRepository_1.default.actualizarStockYPrecioDB(dataStock);
        });
    }
    ;
    static obtenerHistorialStockService() {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener historial de stock desde la base de datos
            const historial = yield stockRepository_1.default.getStockHistory();
            if (!Array.isArray(historial) || historial.length === 0) {
                return { error: "No hay registros de stock disponibles" };
            }
            // Obtener los IDs únicos de usuarios para optimizar las consultas
            const usuariosIds = [...new Set(historial.map((item) => item.id_usuario))];
            // TEMPORALMENTE DESHABILITADO: Consultar el microservicio de usuarios para obtener los nombres completos
            // Código original comentado para fácil reactivación futura
            /*
            const usuariosData = await Promise.all(
                usuariosIds.map(async (id) => {
                    try {
                        const response = await axios.get(`${process.env.USUARIOS_SERVICE_URL}${id}`);
                        
                        return { id_usuario: id, nombre_completo: response.data.nombreCompleto };
                    } catch (error) {
                        console.error(`Error obteniendo datos del usuario ${id}:`, error);
                        return { id_usuario: id, nombre_completo: "Desconocido" };
                    }
                })
            );
            */
            // TEMPORAL: Asignar nombres genéricos para todos los usuarios
            const usuariosData = usuariosIds.map(id => ({
                id_usuario: id,
                nombre_completo: `Usuario Temporal ${id}`
            }));
            // Crear un diccionario para búsqueda rápida
            const usuariosMap = new Map(usuariosData.map(user => [user.id_usuario, user.nombre_completo]));
            // Formatear la respuesta final
            return historial.map((item) => ({
                id_registro: item.id_registro,
                fecha_ingreso: item.fecha_ingreso,
                id_producto: item.id_producto,
                nombre_producto: item.nombre_producto,
                cantidad_ingresada: item.cantidad_ingresada,
                id_usuario: item.id_usuario,
                nombre_completo: usuariosMap.get(item.id_usuario) || "Desconocido"
            }));
        });
    }
    ;
    static obtenerDetalleIngresoService(id_registro) {
        return __awaiter(this, void 0, void 0, function* () {
            const detalleIngreso = yield stockRepository_1.default.obtenerDetalleIngreso(id_registro);
            if (!detalleIngreso) {
                return { error: "Registro no encontrado" };
            }
            try {
                // TEMPORALMENTE DESHABILITADO: Obtener el nombre del usuario desde el microservicio
                // Código original comentado para fácil reactivación futura
                /*
                const response = await axios.get(`${process.env.USUARIOS_SERVICE_URL}${detalleIngreso.id_usuario}`);
                const usuario = response.data;
                
                return {
                    ...detalleIngreso,
                    nombre_completo: usuario?.nombreCompleto || "Desconocido"
                };
                */
                // TEMPORAL: Retornar datos con nombre genérico
                return Object.assign(Object.assign({}, detalleIngreso), { nombre_completo: `Usuario Temporal ${detalleIngreso.id_usuario}` });
            }
            catch (error) {
                console.error(`Error obteniendo datos del usuario ${detalleIngreso.id_usuario}:`, error);
                return Object.assign(Object.assign({}, detalleIngreso), { nombre_completo: "Desconocido" });
            }
        });
    }
    ;
}
exports.default = StockService;
