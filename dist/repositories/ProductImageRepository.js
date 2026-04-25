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
const config_supabaseStorage_1 = __importDefault(require("../config/config-supabaseStorage"));
const ProductImageDto_1 = __importDefault(require("../Dto/productDto/ProductImageDto"));
class ProductImageRepository {
    // Crear múltiples imágenes para un producto
    static createMultipleImages(images) {
        return __awaiter(this, void 0, void 0, function* () {
            if (images.length === 0)
                return [];
            const insertData = images.map(img => ({
                product_id: img.product_id,
                image_url: img.image_url,
                storage_path: img.storage_path,
                is_primary: img.is_primary
            }));
            const { data, error } = yield config_supabaseStorage_1.default
                .from('product_images')
                .insert(insertData)
                .select('id, product_id, image_url, storage_path, created_at, is_primary');
            if (error)
                throw error;
            return (data || []).map(row => new ProductImageDto_1.default(row.product_id, row.image_url, row.storage_path, row.is_primary, row.id, new Date(row.created_at)));
        });
    }
    // Obtener todas las imágenes de un producto
    static getImagesByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('product_images')
                .select('*')
                .eq('product_id', productId)
                .order('is_primary', { ascending: false })
                .order('created_at', { ascending: true });
            if (error)
                throw error;
            return (data || []).map(row => new ProductImageDto_1.default(row.product_id, row.image_url, row.storage_path, row.is_primary, row.id, row.created_at ? new Date(row.created_at) : undefined));
        });
    }
    // Obtener imagen principal de un producto
    static getPrimaryImageByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('product_images')
                .select('*')
                .eq('product_id', productId)
                .eq('is_primary', true)
                .single();
            if (error) {
                if (error.code === 'PGRST116')
                    return null;
                throw error;
            }
            return new ProductImageDto_1.default(data.product_id, data.image_url, data.storage_path, data.is_primary, data.id, data.created_at ? new Date(data.created_at) : undefined);
        });
    }
    // Eliminar una imagen específica
    static deleteImage(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('product_images')
                .delete()
                .eq('id', imageId)
                .select('id');
            if (error)
                throw error;
            return data.length > 0;
        });
    }
    // Eliminar todas las imágenes de un producto
    static deleteAllImagesByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('product_images')
                .delete()
                .eq('product_id', productId)
                .select('product_id');
            if (error)
                throw error;
            return data.length > 0;
        });
    }
    // Establecer imagen principal
    // Nota: Esta operación realiza dos updates. En caso de falla entre ambos,
    // el estado puede quedar inconsistente (sin imagen principal).
    static setPrimaryImage(imageId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Paso 1: Quitar estado principal a todas las imágenes del producto
            const { error: errorReset } = yield config_supabaseStorage_1.default
                .from('product_images')
                .update({ is_primary: false })
                .eq('product_id', productId);
            if (errorReset)
                throw errorReset;
            // Paso 2: Establecer nueva imagen principal
            const { data, error } = yield config_supabaseStorage_1.default
                .from('product_images')
                .update({ is_primary: true })
                .eq('id', imageId)
                .eq('product_id', productId)
                .select('id');
            if (error)
                throw error;
            return data.length > 0;
        });
    }
    // Actualizar información de una imagen
    static updateImage(imageId, imageUrl, storagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield config_supabaseStorage_1.default
                .from('product_images')
                .update({ image_url: imageUrl, storage_path: storagePath })
                .eq('id', imageId)
                .select('*');
            if (error)
                throw error;
            if (!data || data.length === 0)
                return null;
            const row = data[0];
            return new ProductImageDto_1.default(row.product_id, row.image_url, row.storage_path, row.is_primary, row.id, row.created_at ? new Date(row.created_at) : undefined);
        });
    }
}
exports.default = ProductImageRepository;
