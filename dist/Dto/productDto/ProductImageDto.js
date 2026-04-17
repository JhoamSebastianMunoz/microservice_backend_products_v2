"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProductImage {
    constructor(product_id, image_url, storage_path, is_primary = false, id, created_at) {
        this.product_id = product_id;
        this.image_url = image_url;
        this.storage_path = storage_path;
        this.is_primary = is_primary;
        this.id = id;
        this.created_at = created_at;
    }
}
exports.default = ProductImage;
