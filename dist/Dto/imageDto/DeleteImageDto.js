"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeleteImageDto {
    constructor(fileName) {
        this._fileName = fileName;
    }
    //get
    get fileName() {
        return this._fileName;
    }
    //set
    set fileName(fileName) {
        this._fileName = fileName;
    }
}
;
exports.default = DeleteImageDto;
