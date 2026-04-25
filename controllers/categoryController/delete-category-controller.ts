import { Request, Response } from "express";
import CategoriaService from "../../services/categoriaService";




let delete_category = async (req: Request, res: Response) => {  
    try {
        const { id } = req.params;
        const result = await CategoriaService.deleteCategoria(Number(id));
        if (!result) {
            return res.status(404).json({ error: "Categoria no encontrada." });
        }
        else {
            return res.status(200).json({ message: "Categoria eliminada con éxito." });
        }
    } catch (error: any) {
        if (error.code === "ER_ROW_IS_REFERENCED") {
            return res.status(409).json({ error: "No se puede eliminar la Categoria debido a referencias existentes en otros registros." });
        }
        return res.status(500).json({ error: "Error interno del servidor", details: error.message });
    }
};

    export default delete_category;