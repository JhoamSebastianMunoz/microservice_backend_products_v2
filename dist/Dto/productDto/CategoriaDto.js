"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Categoria {
    constructor(nombre_categoria, descripcion) {
        this._nombre_categoria = nombre_categoria;
        this._descripcion = descripcion;
    }
    // Getter
    get nombre_categoria() {
        return this._nombre_categoria;
    }
    get descripcion() {
        return this._descripcion;
    }
    // Setters
    set nombre_categoria(nombre_categoria) {
        this._nombre_categoria = nombre_categoria;
    }
    set descripcion(descripcion) {
        this._descripcion = descripcion;
    }
}
exports.default = Categoria;
