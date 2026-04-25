import supabaseClient from '../config/config-supabaseStorage';
import ProductImage from '../Dto/productDto/ProductImageDto';

interface ProductImageRow {
    id: number;
    product_id: number;
    image_url: string;
    storage_path: string;
    is_primary: boolean;
    created_at: string;
}

class ProductImageRepository {
    // Crear múltiples imágenes para un producto
    static async createMultipleImages(images: ProductImage[]): Promise<ProductImage[]> {
        if (images.length === 0) return [];

        const insertData = images.map(img => ({
            product_id: img.product_id,
            image_url: img.image_url,
            storage_path: img.storage_path,
            is_primary: img.is_primary
        }));

        const { data, error } = await supabaseClient
            .from('product_images')
            .insert(insertData)
            .select('id, product_id, image_url, storage_path, created_at, is_primary');

        if (error) throw error;

        return (data || []).map(row => new ProductImage(
            row.product_id,
            row.image_url,
            row.storage_path,
            row.is_primary,
            row.id,
            new Date(row.created_at)
        ));
    }

    // Obtener todas las imágenes de un producto
    static async getImagesByProductId(productId: number): Promise<ProductImage[]> {
        const { data, error } = await supabaseClient
            .from('product_images')
            .select('*')
            .eq('product_id', productId)
            .order('is_primary', { ascending: false })
            .order('created_at', { ascending: true });

        if (error) throw error;

        return (data || []).map(row => new ProductImage(
            row.product_id,
            row.image_url,
            row.storage_path,
            row.is_primary,
            row.id,
            row.created_at ? new Date(row.created_at) : undefined
        ));
    }

    // Obtener imagen principal de un producto
    static async getPrimaryImageByProductId(productId: number): Promise<ProductImage | null> {
        const { data, error } = await supabaseClient
            .from('product_images')
            .select('*')
            .eq('product_id', productId)
            .eq('is_primary', true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        return new ProductImage(
            data.product_id,
            data.image_url,
            data.storage_path,
            data.is_primary,
            data.id,
            data.created_at ? new Date(data.created_at) : undefined
        );
    }

    // Eliminar una imagen específica
    static async deleteImage(imageId: number): Promise<boolean> {
        const { data, error } = await supabaseClient
            .from('product_images')
            .delete()
            .eq('id', imageId)
            .select('id');

        if (error) throw error;
        return data!.length > 0;
    }

    // Eliminar todas las imágenes de un producto
    static async deleteAllImagesByProductId(productId: number): Promise<boolean> {
        const { data, error } = await supabaseClient
            .from('product_images')
            .delete()
            .eq('product_id', productId)
            .select('product_id');

        if (error) throw error;
        return data!.length > 0;
    }

    // Establecer imagen principal
    // Nota: Esta operación realiza dos updates. En caso de falla entre ambos,
    // el estado puede quedar inconsistente (sin imagen principal).
    static async setPrimaryImage(imageId: number, productId: number): Promise<boolean> {
        // Paso 1: Quitar estado principal a todas las imágenes del producto
        const { error: errorReset } = await supabaseClient
            .from('product_images')
            .update({ is_primary: false })
            .eq('product_id', productId);

        if (errorReset) throw errorReset;

        // Paso 2: Establecer nueva imagen principal
        const { data, error } = await supabaseClient
            .from('product_images')
            .update({ is_primary: true })
            .eq('id', imageId)
            .eq('product_id', productId)
            .select('id');

        if (error) throw error;
        return data!.length > 0;
    }

    // Actualizar información de una imagen
    static async updateImage(imageId: number, imageUrl: string, storagePath: string): Promise<ProductImage | null> {
        const { data, error } = await supabaseClient
            .from('product_images')
            .update({ image_url: imageUrl, storage_path: storagePath })
            .eq('id', imageId)
            .select('*');

        if (error) throw error;
        if (!data || data.length === 0) return null;

        const row = data[0];
        return new ProductImage(
            row.product_id,
            row.image_url,
            row.storage_path,
            row.is_primary,
            row.id,
            row.created_at ? new Date(row.created_at) : undefined
        );
    }
}

export default ProductImageRepository;
