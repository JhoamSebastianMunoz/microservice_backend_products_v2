import { Request, Response } from "express";
import CategoriaService from "../../services/categoriaService";

let get_category = async (req: Request, res: Response) => {  
    try {
        const { id } = req.params;
        const result = await CategoriaService.getCategoriaById(Number(id));
        if(!result) {
            return res.status(404).json({message: 'Categoria no encontrada'})
        }else{
            return res.status(200).json(result);
        }
        
        } catch (error: any) {    
        if (error && error.code == "ER_DUP_ENTRY") {
            console.log(error);
            return res.status(500).json({ errorInfo: error.sqlMessage });
        } else {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
        }
    };

    export default get_category;