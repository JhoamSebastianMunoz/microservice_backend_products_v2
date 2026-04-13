export interface CreateProductWithImagesRequest {
    nombre_producto: string;
    precio: number;
    descripcion?: string;
    cantidad_ingreso?: number;
    id_categoria?: number;
    images: Express.Multer.File[];
    primary_image_index?: number;
}

export default CreateProductWithImagesRequest;
