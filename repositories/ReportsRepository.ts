import db from '../config/config-db';
import GetProduct from "../Dto/productDto/GetProductDto";

class ReportsRepository{
    static async getAllProductsLowStock(umbral: number = 15): Promise<GetProduct[]> {
        const sql = `
            SELECT * FROM productos WHERE cantidad_ingreso < $1
        `;
        const result = await db.query(sql, [umbral]); 
        return result.rows as GetProduct[];
    }
}

export default ReportsRepository;