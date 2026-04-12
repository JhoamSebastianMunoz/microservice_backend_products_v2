import db from '../config/config-db';

class MicroPresaleRepository{
    static async getDataProduct(ids: number[]) {
        // Usar placeholders seguros para PostgreSQL
        const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
        const sql = `SELECT * FROM productos WHERE id_producto IN (${placeholders})`;
        const result = await db.query(sql, ids);
        console.log('Rows from DB:', result.rows); 
        return result.rows;
    }

    // Funcion para actualiza la cantidad de productos
    static async updateProductQuantity(id_producto: number, cantidad: number): Promise<boolean> {
        const sql = `UPDATE productos SET cantidad_ingreso = $1 WHERE id_producto = $2 RETURNING *`;
        const result = await db.query(sql, [cantidad, id_producto]);

        return result.rows.length > 0;
    }
}

export default MicroPresaleRepository;