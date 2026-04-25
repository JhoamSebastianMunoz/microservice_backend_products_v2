class Categoria {
    
    private _nombre_categoria: string;
    private _descripcion?: string;
    
    constructor(
        nombre_categoria: string,
        descripcion?: string,
    ) {
        this._nombre_categoria = nombre_categoria;
        this._descripcion = descripcion;
    }   

    // Getter
    get nombre_categoria(): string {
        return this._nombre_categoria;
    }

    get descripcion(): string | undefined {
        return this._descripcion;
    }

    // Setters
    set nombre_categoria(nombre_categoria: string) {
        this._nombre_categoria = nombre_categoria;
    }  

    set descripcion(descripcion: string | undefined) {
        this._descripcion = descripcion;
    }
}

export default Categoria;