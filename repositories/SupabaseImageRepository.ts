import ImageUploadHelper from '../Helpers/ImageUploadHelper';
import RegisterImage from '../Dto/imageDto/RegisterImageDto';
import DeleteImage from '../Dto/imageDto/DeleteImageDto';
import GetImage from '../Dto/imageDto/GetImageDto';


class SupabaseImageRepository {
    static async uploadToImage(registerImage: RegisterImage): Promise<string> {
        try {
            if (!registerImage.fileName || !registerImage.content) {
                throw new Error("El nombre del archivo o el contenido están vacíos.");
            }

            // Usar ImageUploadHelper con validaciones mejoradas
            const result = await ImageUploadHelper.uploadProductImage(
                registerImage.content,
                registerImage.fileName
            );

            return result.url;
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            throw error;
        }
    }

    static async generatePublicUrl(getImage: GetImage): Promise<string> {
        try {
            const filePath = `productos/${getImage.fileName}`;
            
            // Usar ImageUploadHelper para generar URL pública
            return await ImageUploadHelper.generatePublicUrl(filePath);
        } catch (error) {
            console.error("Error al generar URL pública:", error);
            throw error;
        }
    }

    static async deleteFile(deleteImage: DeleteImage): Promise<void> {
        try {
            const filePath = `productos/${deleteImage.fileName}`;
            
            // Usar ImageUploadHelper para eliminar archivo
            await ImageUploadHelper.deleteImage(filePath);
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
            throw error;
        }
    }
}

export default SupabaseImageRepository;
