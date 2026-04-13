import { v4 as uuid } from 'uuid';
import supabaseClient from '../config/config-supabaseStorage';

interface ImageUploadResult {
    url: string;
    path: string;
    fileName: string;
}

interface UploadOptions {
    maxSizeMB?: number;
    allowedTypes?: string[];
    folder?: string;
}

class ImageUploadHelper {
    private static readonly DEFAULT_MAX_SIZE_MB = 10;
    private static readonly DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    private static readonly DEFAULT_FOLDER = 'productos';

    /**
     * Sube una imagen al bucket de Supabase Storage con validaciones mejoradas
     * @param file Buffer del archivo
     * @param originalName Nombre original del archivo
     * @param productId ID del producto (opcional, para organizar por producto)
     * @param options Opciones de configuración
     * @returns Promise<ImageUploadResult>
     */
    static async uploadProductImage(
        file: Buffer,
        originalName: string,
        productId?: string,
        options: UploadOptions = {}
    ): Promise<ImageUploadResult> {
        try {
            // Validaciones
            this.validateImageFile(file, originalName, options);

            // Configuración
            const maxSizeMB = options.maxSizeMB || this.DEFAULT_MAX_SIZE_MB;
            const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;
            const folder = options.folder || this.DEFAULT_FOLDER;

            // Determinar contentType
            const fileExtension = originalName.split('.').pop()?.toLowerCase();
            const contentType = this.getContentType(fileExtension);

            if (!allowedTypes.includes(contentType)) {
                throw new Error(`Formato de archivo no permitido. Formatos permitidos: ${allowedTypes.join(', ')}`);
            }

            // Generar nombre único
            const uniqueFileName = `${uuid()}.${fileExtension}`;
            const filePath = productId 
                ? `${folder}/${productId}/${uniqueFileName}`
                : `${folder}/${uniqueFileName}`;

            // Obtener nombre del bucket
            const bucketName = process.env.SUPABASE_STORAGE_BUCKET as string;
            if (!bucketName) {
                throw new Error("El nombre del bucket (SUPABASE_STORAGE_BUCKET) no está configurado");
            }

            // Subir archivo a Supabase Storage
            const { data, error } = await supabaseClient.storage
                .from(bucketName)
                .upload(filePath, file, {
                    contentType,
                    upsert: false
                });

            if (error) {
                console.error("Error al subir imagen a Supabase:", error);
                throw new Error(`No se pudo subir la imagen: ${error.message}`);
            }

            // Obtener URL pública
            const { data: { publicUrl } } = supabaseClient.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            return {
                url: publicUrl,
                path: filePath,
                fileName: uniqueFileName
            };

        } catch (error) {
            console.error("Error en ImageUploadHelper:", error);
            throw error;
        }
    }

    /**
     * Elimina una imagen del storage
     * @param filePath Ruta del archivo en el storage
     */
    static async deleteImage(filePath: string): Promise<void> {
        try {
            const bucketName = process.env.SUPABASE_STORAGE_BUCKET as string;
            if (!bucketName) {
                throw new Error("El nombre del bucket (SUPABASE_STORAGE_BUCKET) no está configurado");
            }

            const { error } = await supabaseClient.storage
                .from(bucketName)
                .remove([filePath]);

            if (error) {
                console.error("Error al eliminar imagen de Supabase:", error);
                throw new Error(`No se pudo eliminar la imagen: ${error.message}`);
            }
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
            throw error;
        }
    }

    /**
     * Genera URL pública para una imagen existente
     * @param filePath Ruta del archivo en el storage
     * @returns URL pública
     */
    static async generatePublicUrl(filePath: string): Promise<string> {
        try {
            const bucketName = process.env.SUPABASE_STORAGE_BUCKET as string;
            if (!bucketName) {
                throw new Error("El nombre del bucket (SUPABASE_STORAGE_BUCKET) no está configurado");
            }

            const { data: { publicUrl } } = supabaseClient.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error("Error al generar URL pública:", error);
            throw new Error("No se pudo generar la URL pública para la imagen.");
        }
    }

    /**
     * Valida el archivo de imagen
     */
    private static validateImageFile(
        file: Buffer, 
        originalName: string, 
        options: UploadOptions
    ): void {
        if (!file || !(file instanceof Buffer)) {
            throw new Error("El contenido del archivo es inválido.");
        }

        if (!originalName || typeof originalName !== 'string') {
            throw new Error("El nombre del archivo es obligatorio.");
        }

        const maxSizeMB = options.maxSizeMB || this.DEFAULT_MAX_SIZE_MB;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (file.length > maxSizeBytes) {
            throw new Error(`El archivo excede el tamaño máximo permitido de ${maxSizeMB}MB.`);
        }

        const fileExtension = originalName.split('.').pop()?.toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];

        if (!fileExtension || !validExtensions.includes(fileExtension)) {
            throw new Error(`Extensión de archivo no válida. Extensiones permitidas: ${validExtensions.join(', ')}`);
        }
    }

    /**
     * Obtiene el content type basado en la extensión del archivo
     */
    private static getContentType(extension?: string): string {
        switch (extension) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'webp':
                return 'image/webp';
            default:
                return 'image/jpeg'; // Default
        }
    }
}

export default ImageUploadHelper;
