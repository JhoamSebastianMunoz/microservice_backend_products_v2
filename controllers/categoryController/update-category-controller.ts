import {Request, Response} from 'express';
import CategoriaService from '../../services/categoriaService';
import Categoria from '../../Dto/productDto/CategoriaDto';

let update_category = async(req:Request, res:Response)=>{
    try {
        const { id } = req.params;
        const { nombre_categoria } = req.body;
        
        const result = await CategoriaService.updateCategoria(new Categoria(nombre_categoria), Number(id));
            if(!result){
                return res.status(404).json({ error: "Categoria no encontrada." });
            }
            else{ return res.status(200).json(
                {status:'Ok, Categoria actualizado con éxito.'}
            ); 
            }
        }catch(error:any){
            if(error && error.code == "ER_DUP_ENTRY"){
                return res.status(500).json({errorInfo: error.sqlMessage})
            }else{
                return res.status(500).json({error: "Internal Server Error", details: error.message })
            }
        }
};

export default update_category;