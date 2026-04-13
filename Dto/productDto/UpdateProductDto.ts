export interface UpdateProductRequest {
    id: number;
    nombre_producto?: string;
    precio?: number;
    descripcion?: string;
    id_categoria?: number | null;
}

export default UpdateProductRequest;