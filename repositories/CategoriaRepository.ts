import supabaseClient from '../config/config-supabaseStorage';
import Categoria from '../Dto/productDto/CategoriaDto';

interface CategoriaRow {
    id_categoria: number;
    nombre_categoria: string;
}

class CategoriaRepository {
    static async getAll(): Promise<CategoriaRow[]> {
        const { data, error } = await supabaseClient
            .from('categorias')
            .select('*');
        
        if (error) throw error;
        return data as CategoriaRow[];
    }
    
    static async getById(id: number): Promise<CategoriaRow | null> {
        const { data, error } = await supabaseClient
            .from('categorias')
            .select('*')
            .eq('id_categoria', id)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        
        return data as CategoriaRow;
    }
    
    static async add(categoria: Categoria): Promise<CategoriaRow> {
        const { data, error } = await supabaseClient
            .from('categorias')
            .insert([{ nombre_categoria: categoria.nombre_categoria }])
            .select('*');
        
        if (error) throw error;
        return data![0] as CategoriaRow;
    }
    
    static async update(id: number, categoria: Categoria): Promise<boolean> {
        const { data, error } = await supabaseClient
            .from('categorias')
            .update({ nombre_categoria: categoria.nombre_categoria })
            .eq('id_categoria', id)
            .select('*');
        
        if (error) throw error;
        return data!.length > 0;
    }
    
    static async delete(id: number): Promise<boolean> {
        const { data, error } = await supabaseClient
            .from('categorias')
            .delete()
            .eq('id_categoria', id)
            .select('*');
        
        if (error) throw error;
        return data!.length > 0;
    }
}

export default CategoriaRepository;