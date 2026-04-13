import Product from "./ProductDto";

class UpdateProduct extends Product {
    
private _id_producto: string;

    constructor(
        nombre_producto: string, precio: number,
        descripcion: string, id_categoria: number | null,
        id_producto: string
        ) 
    {
        super(nombre_producto, precio,
            descripcion, 0, id_categoria);
        this._id_producto = id_producto;
    }
    // Getters
    get id_producto(): string {
        return this._id_producto;
    }
    
    // Setters
    set id_producto(id_producto: string) {
        this._id_producto = id_producto;
    }
};

export default UpdateProduct;