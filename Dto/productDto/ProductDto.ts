export interface Product {
    nombre_producto: string;
    precio: number;
    descripcion?: string;
    cantidad_ingreso?: number;
    id_categoria?: number | null;
}

export interface CreateProductRequest {
    nombre_producto: string;
    precio: number;
    descripcion?: string;
    cantidad_ingreso?: number;
    id_categoria?: number;
}

export interface UpdateProductRequest {
    nombre_producto?: string;
    precio?: number;
    descripcion?: string;
    id_categoria?: number;
}

export interface ProductResponse {
    id: number;
    nombre_producto: string;
    precio: number;
    descripcion?: string;
    cantidad_ingreso: number;
    id_categoria?: number;
    imagenes?: ProductImage[];
}

export interface ProductImage {
    id: number;
    url_imagen: string;
    es_principal: boolean;
}

export interface ProductImageDto {
    id?: number;
    url_imagen?: string;
    es_principal?: boolean;
    product_id?: number;
    image_url?: string;
    storage_path?: string;
    is_primary?: boolean;
    created_at?: Date;
}