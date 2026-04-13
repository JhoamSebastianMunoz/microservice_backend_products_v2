import ProductRepository from '../repositories/ProductRepository';
import { CreateProductRequest } from '../Dto/productDto/ProductDto';
import GetProductRequest from '../Dto/productDto/GetProductDto';
import DeleteProductRequest from '../Dto/productDto/DeleteProductDto';
import UpdateProductRequest from '../Dto/productDto/UpdateProductDto';

class ProductService {
    
    static async register_product(product: CreateProductRequest) {
        return await ProductRepository.add(product);
    }
    static async getProducts(){
        return await ProductRepository.getAll();
    }
    static async getProduct(getProduct : GetProductRequest){
        return await ProductRepository.get(getProduct);
    }
    static async deleteProduct(deleteProduct: DeleteProductRequest){
        return await ProductRepository.delete(deleteProduct);
    } 
    static async updateProduct(updateProduct: UpdateProductRequest){
        return await ProductRepository.update(updateProduct);
        }
};

export default ProductService;