import ProductRepository from '../repositories/ProductRepository';
import { CreateProductRequest } from '../Dto/productDto/ProductDto';
import GetProductRequest from '../Dto/productDto/GetProductDto';
import DeleteProductRequest from '../Dto/productDto/DeleteProductDto';
import UpdateProductRequest from '../Dto/productDto/UpdateProductDto';

class ProductService {
    
    static async register_product(product: CreateProductRequest) {
        const result = await ProductRepository.add({
            ...product,
            cantidad_ingreso: product.cantidad_ingreso || 0
        });
        return result;
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