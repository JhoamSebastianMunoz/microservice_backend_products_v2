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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOperationService = exports.ProductStrategyFactory = exports.GetProductWithImagesStrategy = exports.UpdateProductWithImagesStrategy = exports.CreateProductWithImagesStrategy = void 0;
const ProductService_1 = __importDefault(require("./ProductService"));
const ProductImageService_1 = __importDefault(require("./ProductImageService"));
// Estrategia para crear producto con imágenes
class CreateProductWithImagesStrategy {
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extraer datos del producto
                const { images, primary_image_index } = request, productData = __rest(request, ["images", "primary_image_index"]);
                // Crear producto
                const result = yield ProductService_1.default.register_product(productData);
                if (!(result === null || result === void 0 ? void 0 : result.insertId)) {
                    throw new Error('No se pudo crear el producto');
                }
                // Procesar imágenes si existen
                let processedImages = [];
                if (images && images.length > 0) {
                    processedImages = yield ProductImageService_1.default.uploadMultipleImages(result.insertId, images, primary_image_index);
                }
                return {
                    id: result.insertId,
                    nombre_producto: productData.nombre_producto,
                    precio: productData.precio,
                    descripcion: productData.descripcion,
                    cantidad_ingreso: productData.cantidad_ingreso || 0,
                    id_categoria: productData.id_categoria,
                    imagenes: processedImages.map(img => ({
                        id: img.id,
                        url_imagen: img.url_imagen || img.image_url,
                        es_principal: img.es_principal || img.is_primary
                    }))
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.CreateProductWithImagesStrategy = CreateProductWithImagesStrategy;
// Estrategia para actualizar producto con gestión de imágenes
class UpdateProductWithImagesStrategy {
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { images, delete_images, primary_image_index } = request;
                // Actualizar datos del producto
                const result = yield ProductService_1.default.updateProduct({
                    id: request.id,
                    nombre_producto: request.nombre_producto,
                    precio: request.precio,
                    descripcion: request.descripcion,
                    id_categoria: request.id_categoria
                });
                if (!result || result.affectedRows === 0) {
                    throw new Error('Producto no encontrado');
                }
                // Procesar imágenes
                const imageResults = yield ProductImageService_1.default.processProductImages(request.id, images || [], delete_images, primary_image_index);
                // Obtener datos actualizados del producto
                const getProductRequest = { id: request.id };
                const updatedProduct = yield ProductService_1.default.getProduct(getProductRequest);
                if (!updatedProduct || updatedProduct.length === 0) {
                    throw new Error('No se pudo obtener el producto actualizado');
                }
                return {
                    id: updatedProduct[0].id,
                    nombre_producto: updatedProduct[0].nombre_producto,
                    precio: updatedProduct[0].precio,
                    descripcion: updatedProduct[0].descripcion,
                    cantidad_ingreso: updatedProduct[0].cantidad_ingreso,
                    id_categoria: updatedProduct[0].id_categoria,
                    imagenes: imageResults.uploaded.map(img => ({
                        id: img.id,
                        url_imagen: img.url_imagen || img.image_url,
                        es_principal: img.es_principal || img.is_primary
                    }))
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UpdateProductWithImagesStrategy = UpdateProductWithImagesStrategy;
// Estrategia para obtener producto con imágenes
class GetProductWithImagesStrategy {
    execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request;
                // Obtener datos del producto
                const productResult = yield ProductService_1.default.getProduct({ id });
                if (!productResult || productResult.length === 0) {
                    throw new Error('Producto no encontrado');
                }
                // Obtener imágenes del producto
                const images = yield ProductImageService_1.default.getProductImages(id);
                return {
                    id: productResult[0].id,
                    nombre_producto: productResult[0].nombre_producto,
                    precio: productResult[0].precio,
                    descripcion: productResult[0].descripcion,
                    cantidad_ingreso: productResult[0].cantidad_ingreso,
                    id_categoria: productResult[0].id_categoria,
                    imagenes: images.map((img) => ({
                        id: img.id,
                        url_imagen: img.url_imagen || img.image_url,
                        es_principal: img.es_principal || img.is_primary
                    }))
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.GetProductWithImagesStrategy = GetProductWithImagesStrategy;
// Fábrica de estrategias
class ProductStrategyFactory {
    static createStrategy(operation) {
        switch (operation) {
            case 'create':
                return new CreateProductWithImagesStrategy();
            case 'update':
                return new UpdateProductWithImagesStrategy();
            case 'get':
                return new GetProductWithImagesStrategy();
            default:
                throw new Error(`Operación no soportada: ${operation}`);
        }
    }
}
exports.ProductStrategyFactory = ProductStrategyFactory;
// Servicio de alto nivel que utiliza las estrategias
class ProductOperationService {
    static executeOperation(operation, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const strategy = ProductStrategyFactory.createStrategy(operation);
            return yield strategy.execute(request);
        });
    }
}
exports.ProductOperationService = ProductOperationService;
