"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegisterImage {
    constructor(fileName, content) {
        if (!fileName)
            throw new Error("El nombre del archivo es obligatorio.");
        if (!content || !(content instanceof Buffer))
            throw new Error("El contenido del archivo es inválido.");
        this._fileName = fileName;
        this._content = content;
    }
    //get
    get fileName() {
        return this._fileName;
    }
    get content() {
        return this._content;
    }
    ;
    //set
    set fileName(fileName) {
        this._fileName = fileName;
    }
    set content(content) {
        this._content = content;
    }
    ;
}
;
exports.default = RegisterImage;
