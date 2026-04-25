import { Request, Response } from "express";
import Categoria from "../../Dto/productDto/CategoriaDto";
import CategoriaService from "../../services/categoriaService";

let register_category = async (req: Request, res: Response) => {  
  try {
    const { nombre_categoria, descripcion } = req.body;
    await CategoriaService.createCategoria(new Categoria(nombre_categoria, descripcion))
    
    return res.status(201).json(
      { status: 'Categoria registrado con éxito'}
    );
  } catch (error: any) {    
    if (error && error.code == "ER_DUP_ENTRY") {
        return res.status(500).json({ errorInfo: error.sqlMessage });
    } else {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  }
};


export default register_category;