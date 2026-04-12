import db from '../config/config-db';
import Categoria from '../Dto/productDto/CategoriaDto';

class CategoriaRepository {
    static async getAll() {
        const sql = 'SELECT * FROM categorias';
        const result = await db.query(sql);
        return result.rows;
    }
    
    static async getById(id: number) {
        const sql = 'SELECT * FROM categorias WHERE id_categoria = $1';
        const result = await db.query(sql, [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    
    static async add(categoria: Categoria) {
        const sql = 'INSERT INTO categorias (nombre_categoria) VALUES ($1) RETURNING *';
        const values = [categoria.nombre_categoria];
        const result = await db.query(sql, values);
        return result.rows[0];
    }
    
    static async update(id: number, categoria: Categoria) {
        const sql = 'UPDATE categorias SET nombre_categoria = $1 WHERE id_categoria = $2 RETURNING *';
        const values = [categoria.nombre_categoria, id];
        const result = await db.query(sql, values);
        return result.rows.length > 0;
    }
    
    static async delete(id: number) {
        const sql = 'DELETE FROM categorias WHERE id_categoria = $1 RETURNING *';
        const result = await db.query(sql, [id]); 
        return result.rows.length > 0;
    }
}

export default CategoriaRepository;