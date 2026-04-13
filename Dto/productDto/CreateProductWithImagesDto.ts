import ProductImage from './ProductImageDto';

export default class CreateProductWithImages {
    constructor(
        public nombre_producto: string,
        public precio: number,
        public descripcion?: string,
        public cantidad_ingreso?: number,
        public id_categoria?: number,
        public images: Express.Multer.File[] = [],
        public primary_image_index?: number
    ) {}
}
