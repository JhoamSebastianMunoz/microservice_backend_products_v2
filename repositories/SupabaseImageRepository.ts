import { v4 as uuid } from 'uuid';
import supabaseClient from "../config/config-supabaseStorage";
import RegisterImage from '../Dto/imageDto/RegisterImageDto';
import DeleteImage from '../Dto/imageDto/DeleteImageDto';
import GetImage from '../Dto/imageDto/GetImageDto';

const bucketName: string = process.env.SUPABASE_STORAGE_BUCKET as string;

if (!bucketName) {
    throw new Error("El nombre del bucket (SUPABASE_STORAGE_BUCKET) no está configurado en el archivo .env");
}

class SupabaseImageRepository {
    static async uploadToImage(registerImage: RegisterImage): Promise<string> {
        try {
            if (!registerImage.fileName || !registerImage.content) {
                throw new Error("El nombre del archivo o el contenido están vacíos.");
            }

            // Generar nombre único para el archivo
            const fileExtension = registerImage.fileName.split(".").pop();
            const fileName = `${uuid()}.${fileExtension}`;
            const filePath = `productos/${fileName}`;

            // Subir archivo a Supabase Storage
            const { data, error } = await supabaseClient.storage
                .from(bucketName)
                .upload(filePath, registerImage.content, {
                    contentType: 'image/jpeg',
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

            return publicUrl;
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            throw new Error("No se pudo subir la imagen a Supabase Storage.");
        }
    }

    static async generatePublicUrl(getImage: GetImage): Promise<string> {
        try {
            const filePath = `productos/${getImage.fileName}`;

            // Verificar si el archivo existe
            const { data, error } = await supabaseClient.storage
                .from(bucketName)
                .list('productos', {
                    search: getImage.fileName
                });

            if (error || !data || data.length === 0) {
                throw new Error(`La imagen con el nombre ${getImage.fileName} no existe.`);
            }

            // Obtener URL pública
            const { data: { publicUrl } } = supabaseClient.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error("Error al generar URL pública:", error);
            throw new Error("No se pudo generar la URL pública para la imagen.");
        }
    }

    static async deleteFile(deleteImage: DeleteImage): Promise<void> {
        try {
            const filePath = `productos/${deleteImage.fileName}`;

            // Eliminar archivo de Supabase Storage
            const { error } = await supabaseClient.storage
                .from(bucketName)
                .remove([filePath]);

            if (error) {
                console.error("Error al eliminar imagen de Supabase:", error);
                throw new Error(`No se pudo eliminar la imagen: ${error.message}`);
            }
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
            throw new Error("No se pudo eliminar la imagen de Supabase Storage.");
        }
    }
}

export default SupabaseImageRepository;
