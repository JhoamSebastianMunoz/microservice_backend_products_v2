import supabaseClient from '../config/config-supabaseStorage';
import StockDto from '../Dto/productDto/StockDto';

interface StockHistoryRow {
    id_registro: number;
    fecha_ingreso: string;
    id_producto: number;
    nombre_producto: string;
    cantidad_ingresada: number;
    id_usuario: number;
}

interface StockDetailRow {
    id_registro: number;
    codigo_factura: string;
    fecha_vencimiento: string;
    cantidad_ingreso: number;
    costo_total: number;
    costo_unitario: number;
    porcentaje_venta: number;
    id_producto: number;
    nombre_producto: string;
    cantidad_ingresada: number;
    id_usuario: number;
}

class StockRepository {

    static async verificarProducto(id_producto: number): Promise<boolean> {
        const { data, error } = await supabaseClient
            .from('productos')
            .select('id_producto')
            .eq('id_producto', id_producto)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return !!data;
    }
    
    static async registrarStockDB(dataStock: StockDto, id_usuario: number) {
        const { error } = await supabaseClient
            .from('registro_stock')
            .insert([{
                id_producto: dataStock.id_producto,
                cantidad_ingresada: dataStock.cantidad_ingresada,
                fecha_vencimiento: dataStock.fecha_vencimiento,
                codigo_factura: dataStock.codigo_factura,
                costo_total: dataStock.costo_total,
                costo_unitario: dataStock.costo_unitario,
                porcentaje_venta: dataStock.porcentaje_venta,
                id_usuario: id_usuario
            }]);
        
        if (error) throw error;
    }

    static async actualizarStockYPrecioDB(dataStock: StockDto) {
        // Calcular el nuevo precio del producto basado en el porcentaje de ganancia
        const nuevo_precio = dataStock.costo_unitario + (dataStock.costo_unitario * (dataStock.porcentaje_venta / 100));
        
        // Obtener cantidad actual primero
        const { data: producto, error: errorSelect } = await supabaseClient
            .from('productos')
            .select('cantidad_ingreso')
            .eq('id_producto', dataStock.id_producto)
            .single();
        
        if (errorSelect) throw errorSelect;
        
        const { error } = await supabaseClient
            .from('productos')
            .update({
                cantidad_ingreso: (producto?.cantidad_ingreso || 0) + dataStock.cantidad_ingresada,
                precio: nuevo_precio
            })
            .eq('id_producto', dataStock.id_producto);
        
        if (error) throw error;
    }
    
    static async getStockHistory(): Promise<StockHistoryRow[]> {
        const { data, error } = await supabaseClient
            .from('registro_stock')
            .select(`
                id_registro,
                fecha_ingreso,
                id_producto,
                cantidad_ingresada,
                id_usuario,
                productos(nombre_producto)
            `)
            .order('fecha_ingreso', { ascending: false });
        
        if (error) throw error;
        
        // Transformar los datos para mantener compatibilidad
        return (data || []).map(row => ({
            id_registro: row.id_registro,
            fecha_ingreso: row.fecha_ingreso,
            id_producto: row.id_producto,
            cantidad_ingresada: row.cantidad_ingresada,
            id_usuario: row.id_usuario,
            nombre_producto: (row.productos as any)?.nombre_producto || null
        })) as StockHistoryRow[];
    }

    static async obtenerDetalleIngreso(id_registro: number): Promise<StockDetailRow | null> {
        const { data, error } = await supabaseClient
            .from('registro_stock')
            .select(`
                id_registro,
                codigo_factura,
                fecha_vencimiento,
                cantidad_ingresada,
                costo_total,
                costo_unitario,
                porcentaje_venta,
                id_producto,
                id_usuario,
                productos(nombre_producto)
            `)
            .eq('id_registro', id_registro)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        
        // Transformar los datos para mantener compatibilidad
        return {
            id_registro: data.id_registro,
            codigo_factura: data.codigo_factura,
            fecha_vencimiento: data.fecha_vencimiento,
            cantidad_ingreso: data.cantidad_ingresada,
            cantidad_ingresada: data.cantidad_ingresada,
            costo_total: data.costo_total,
            costo_unitario: data.costo_unitario,
            porcentaje_venta: data.porcentaje_venta,
            id_producto: data.id_producto,
            id_usuario: data.id_usuario,
            nombre_producto: (data.productos as any)?.nombre_producto || null
        } as StockDetailRow;
    }
}

export default StockRepository;

