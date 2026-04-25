import supabaseClient from '../config/config-supabaseStorage';

interface ProductRow {
    id_producto: number;
    nombre_producto: string;
    precio: number;
    descripcion: string;
    cantidad_ingreso: number;
    id_categoria: number;
}

class MicroPresaleRepository {
    static async getDataProduct(ids: number[]): Promise<ProductRow[]> {
        const { data, error } = await supabaseClient
            .from('productos')
            .select('*')
            .in('id_producto', ids);
        
        if (error) throw error;
        return data as ProductRow[];
    }

    static async updateProductQuantity(id_producto: number, cantidad: number): Promise<boolean> {
        const { data, error } = await supabaseClient
            .from('productos')
            .update({ cantidad_ingreso: cantidad })
            .eq('id_producto', id_producto)
            .select('*');
        
        if (error) throw error;
        return data!.length > 0;
    }
}

export default MicroPresaleRepository;