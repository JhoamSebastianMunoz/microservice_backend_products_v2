import SupabaseImageRepository from '../repositories/SupabaseImageRepository';
import RegisterImage from '../Dto/imageDto/RegisterImageDto';
import DeleteImage from '../Dto/imageDto/DeleteImageDto';
import GetImage from '../Dto/imageDto/GetImageDto';

class ImageService {
    static async registerImage(registerImage: RegisterImage){
        return await SupabaseImageRepository.uploadToImage(registerImage)
    }
    static async deleteImage(deleteImage: DeleteImage){
        return await SupabaseImageRepository.deleteFile(deleteImage)
    }
    static async getImage(getImage: GetImage){
        return await SupabaseImageRepository.generatePublicUrl(getImage)
    }
};
export default ImageService;