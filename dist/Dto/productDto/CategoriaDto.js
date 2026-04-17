"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Categoria {
    constructor(nombre_categoria) {
        this._nombre_categoria = nombre_categoria;
    }
    // Getter
    get nombre_categoria() {
        return this._nombre_categoria;
    }
    // Setters
    set nombre_categoria(nombre_categoria) {
        this._nombre_categoria = nombre_categoria;
    }
}
exports.default = Categoria;
