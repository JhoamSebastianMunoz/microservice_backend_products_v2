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
const config_db_1 = __importDefault(require("../config/config-db"));
const ProductImageDto_1 = __importDefault(require("../Dto/productDto/ProductImageDto"));
class ProductImageRepository {
    // Crear múltiples imágenes para un producto
    static createMultipleImages(images) {
        return __awaiter(this, void 0, void 0, function* () {
            if (images.length === 0)
                return [];
            const values = images.map(img => `(${img.product_id}, '${img.image_url}', '${img.storage_path}', ${img.is_primary})`).join(', ');
            const query = `
            INSERT INTO product_images (product_id, image_url, storage_path, is_primary)
            VALUES ${values}
            RETURNING id, product_id, image_url, storage_path, created_at, is_primary
        `;
            try {
                const result = yield config_db_1.default.query(query);
                return result.rows.map(row => new ProductImageDto_1.default(row.product_id, row.image_url, row.storage_path, row.is_primary, row.id, row.created_at));
            }
            catch (error) {
                console.error('Error creating multiple product images:', error);
                throw new Error('Failed to create product images');
            }
        });
    }
    // Obtener todas las imágenes de un producto
    static getImagesByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id, product_id, image_url, storage_path, created_at, is_primary
            FROM product_images 
            WHERE product_id = $1 
            ORDER BY is_primary DESC, created_at ASC
        `;
            try {
                const result = yield config_db_1.default.query(query, [productId]);
                return result.rows.map(row => new ProductImageDto_1.default(row.product_id, row.image_url, row.storage_path, row.is_primary, row.id, row.created_at));
            }
            catch (error) {
                console.error('Error getting product images:', error);
                throw new Error('Failed to get product images');
            }
        });
    }
    // Obtener imagen principal de un producto
    static getPrimaryImageByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id, product_id, image_url, storage_path, created_at, is_primary
            FROM product_images 
            WHERE product_id = $1 AND is_primary = true
            LIMIT 1
        `;
            try {
                const result = yield config_db_1.default.query(query, [productId]);
                if (result.rows.length === 0)
                    return null;
                const row = result.rows[0];
                return new ProductImageDto_1.default(row.product_id, row.image_url, row.storage_path, row.is_primary, row.id, row.created_at);
            }
            catch (error) {
                console.error('Error getting primary product image:', error);
                throw new Error('Failed to get primary product image');
            }
        });
    }
    // Eliminar una imagen específica
    static deleteImage(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM product_images WHERE id = $1 RETURNING id';
            try {
                const result = yield config_db_1.default.query(query, [imageId]);
                return result.rows.length > 0;
            }
            catch (error) {
                console.error('Error deleting product image:', error);
                throw new Error('Failed to delete product image');
            }
        });
    }
    // Eliminar todas las imágenes de un producto
    static deleteAllImagesByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM product_images WHERE product_id = $1 RETURNING product_id';
            try {
                const result = yield config_db_1.default.query(query, [productId]);
                return result.rows.length > 0;
            }
            catch (error) {
                console.error('Error deleting all product images:', error);
                throw new Error('Failed to delete all product images');
            }
        });
    }
    // Establecer imagen principal
    static setPrimaryImage(imageId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield config_db_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Quitar estado principal a todas las imágenes del producto
                yield client.query('UPDATE product_images SET is_primary = false WHERE product_id = $1', [productId]);
                // Establecer nueva imagen principal
                const result = yield client.query('UPDATE product_images SET is_primary = true WHERE id = $1 AND product_id = $2 RETURNING id', [imageId, productId]);
                yield client.query('COMMIT');
                return result.rows.length > 0;
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Error setting primary image:', error);
                throw new Error('Failed to set primary image');
            }
            finally {
                client.release();
            }
        });
    }
    // Actualizar información de una imagen
    static updateImage(imageId, imageUrl, storagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            UPDATE product_images 
            SET image_url = $1, storage_path = $2 
            WHERE id = $3 
            RETURNING id, product_id, image_url, storage_path, created_at, is_primary
        `;
            try {
                const result = yield config_db_1.default.query(query, [imageUrl, storagePath, imageId]);
                if (result.rows.length === 0)
                    return null;
                const row = result.rows[0];
                return new ProductImageDto_1.default(row.product_id, row.image_url, row.storage_path, row.is_primary, row.id, row.created_at);
            }
            catch (error) {
                console.error('Error updating product image:', error);
                throw new Error('Failed to update product image');
            }
        });
    }
}
exports.default = ProductImageRepository;
