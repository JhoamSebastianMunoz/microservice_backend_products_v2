import db from '../config/config-db';
import ProductImage from '../Dto/productDto/ProductImageDto';

class ProductImageRepository {
    // Crear múltiples imágenes para un producto
    static async createMultipleImages(images: ProductImage[]): Promise<ProductImage[]> {
        if (images.length === 0) return [];

        const values = images.map(img => 
            `(${img.product_id}, '${img.image_url}', '${img.storage_path}', ${img.is_primary})`
        ).join(', ');

        const query = `
            INSERT INTO product_images (product_id, image_url, storage_path, is_primary)
            VALUES ${values}
            RETURNING id, product_id, image_url, storage_path, created_at, is_primary
        `;

        try {
            const result = await db.query(query);
            return result.rows.map(row => new ProductImage(
                row.product_id,
                row.image_url,
                row.storage_path,
                row.is_primary,
                row.id,
                row.created_at
            ));
        } catch (error) {
            console.error('Error creating multiple product images:', error);
            throw new Error('Failed to create product images');
        }
    }

    // Obtener todas las imágenes de un producto
    static async getImagesByProductId(productId: number): Promise<ProductImage[]> {
        const query = `
            SELECT id, product_id, image_url, storage_path, created_at, is_primary
            FROM product_images 
            WHERE product_id = $1 
            ORDER BY is_primary DESC, created_at ASC
        `;

        try {
            const result = await db.query(query, [productId]);
            return result.rows.map(row => new ProductImage(
                row.product_id,
                row.image_url,
                row.storage_path,
                row.is_primary,
                row.id,
                row.created_at
            ));
        } catch (error) {
            console.error('Error getting product images:', error);
            throw new Error('Failed to get product images');
        }
    }

    // Obtener imagen principal de un producto
    static async getPrimaryImageByProductId(productId: number): Promise<ProductImage | null> {
        const query = `
            SELECT id, product_id, image_url, storage_path, created_at, is_primary
            FROM product_images 
            WHERE product_id = $1 AND is_primary = true
            LIMIT 1
        `;

        try {
            const result = await db.query(query, [productId]);
            if (result.rows.length === 0) return null;

            const row = result.rows[0];
            return new ProductImage(
                row.product_id,
                row.image_url,
                row.storage_path,
                row.is_primary,
                row.id,
                row.created_at
            );
        } catch (error) {
            console.error('Error getting primary product image:', error);
            throw new Error('Failed to get primary product image');
        }
    }

    // Eliminar una imagen específica
    static async deleteImage(imageId: number): Promise<boolean> {
        const query = 'DELETE FROM product_images WHERE id = $1 RETURNING id';

        try {
            const result = await db.query(query, [imageId]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error deleting product image:', error);
            throw new Error('Failed to delete product image');
        }
    }

    // Eliminar todas las imágenes de un producto
    static async deleteAllImagesByProductId(productId: number): Promise<boolean> {
        const query = 'DELETE FROM product_images WHERE product_id = $1 RETURNING product_id';

        try {
            const result = await db.query(query, [productId]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error deleting all product images:', error);
            throw new Error('Failed to delete all product images');
        }
    }

    // Establecer imagen principal
    static async setPrimaryImage(imageId: number, productId: number): Promise<boolean> {
        const client = await db.connect();
        
        try {
            await client.query('BEGIN');

            // Quitar estado principal a todas las imágenes del producto
            await client.query(
                'UPDATE product_images SET is_primary = false WHERE product_id = $1',
                [productId]
            );

            // Establecer nueva imagen principal
            const result = await client.query(
                'UPDATE product_images SET is_primary = true WHERE id = $1 AND product_id = $2 RETURNING id',
                [imageId, productId]
            );

            await client.query('COMMIT');
            return result.rows.length > 0;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error setting primary image:', error);
            throw new Error('Failed to set primary image');
        } finally {
            client.release();
        }
    }

    // Actualizar información de una imagen
    static async updateImage(imageId: number, imageUrl: string, storagePath: string): Promise<ProductImage | null> {
        const query = `
            UPDATE product_images 
            SET image_url = $1, storage_path = $2 
            WHERE id = $3 
            RETURNING id, product_id, image_url, storage_path, created_at, is_primary
        `;

        try {
            const result = await db.query(query, [imageUrl, storagePath, imageId]);
            if (result.rows.length === 0) return null;

            const row = result.rows[0];
            return new ProductImage(
                row.product_id,
                row.image_url,
                row.storage_path,
                row.is_primary,
                row.id,
                row.created_at
            );
        } catch (error) {
            console.error('Error updating product image:', error);
            throw new Error('Failed to update product image');
        }
    }
}

export default ProductImageRepository;
