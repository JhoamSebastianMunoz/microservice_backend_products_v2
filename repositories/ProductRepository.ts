import supabaseClient from '../config/config-supabaseStorage';
import Product from '../Dto/productDto/ProductDto';
import GetProduct from '../Dto/productDto/GetProductDto';
import DeleteProduct from '../Dto/productDto/DeleteProductDto';
import UpdateProduct from '../Dto/productDto/UpdateProductDto';


class ProductRepository {
    static async add(product: Product){
        const { data, error } = await supabaseClient
            .from('productos')
            .insert([
                {
                    nombre_producto: product.nombre_producto,
                    precio: product.precio,
                    descripcion: product.descripcion,
                    cantidad_ingreso: product.cantidad_ingreso,
                    id_imagen: product.id_imagen,
                    id_categoria: product.id_categoria
                }
            ])
            .select('*');
        
        if (error) throw error;
        return data![0];
    }
    static async getAll(): Promise<GetProduct[]> {
        const { data, error } = await supabaseClient
            .from('productos')
            .select(`
                *,
                categorias(nombre_categoria)
            `);
        
        if (error) throw error;
        
        // Transformar los datos para que coincidan con la estructura esperada
        return data!.map(product => ({
            ...product,
            nombre_categoria: product.categorias?.nombre_categoria || null
        })) as GetProduct[];
    }
    static async get(getProduct : GetProduct){
        const { data, error } = await supabaseClient
            .from('productos')
            .select(`
                *,
                categorias(nombre_categoria)
            `)
            .eq('id_producto', getProduct.id_producto)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                return []; // No encontrado
            }
            throw error;
        }
        
        const transformedData = {
            ...data,
            nombre_categoria: data.categorias?.nombre_categoria || null
        };
        
        return [transformedData] as GetProduct[];
    }
    static async delete(deleteProduct : DeleteProduct){
        const { data, error } = await supabaseClient
            .from('productos')
            .delete()
            .eq('id_producto', deleteProduct.id_producto)
            .select('*');
        
        if (error) throw error;
        return data!.length > 0; // Devuelve true si se eliminó, false si no.
    }
    static async update(updateProduct : UpdateProduct){
        const { data, error } = await supabaseClient
            .from('productos')
            .update({
                nombre_producto: updateProduct.nombre_producto,
                precio: updateProduct.precio,
                descripcion: updateProduct.descripcion,
                id_categoria: updateProduct.id_categoria,
                id_imagen: updateProduct.id_imagen
            })
            .eq('id_producto', updateProduct.id_producto)
            .select('*');
        
        if (error) throw error;
        return data![0];
    }
};

export default ProductRepository;