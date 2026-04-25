import supabaseClient from '../config/config-supabaseStorage';
import GetProduct from "../Dto/productDto/GetProductDto";

class ReportsRepository {
    static async getAllProductsLowStock(umbral: number = 15): Promise<GetProduct[]> {
        const { data, error } = await supabaseClient
            .from('productos')
            .select('*')
            .lt('cantidad_ingreso', umbral);
        
        if (error) throw error;
        return data as GetProduct[];
    }
}

export default ReportsRepository;