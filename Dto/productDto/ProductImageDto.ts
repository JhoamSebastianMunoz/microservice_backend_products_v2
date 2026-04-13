export default class ProductImage {
    constructor(
        public product_id: number,
        public image_url: string,
        public storage_path: string,
        public is_primary: boolean = false,
        public id?: number,
        public created_at?: Date
    ) {}
}
