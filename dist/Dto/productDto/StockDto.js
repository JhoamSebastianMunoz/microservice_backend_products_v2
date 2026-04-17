"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StockDto {
    constructor(id_producto, cantidad_ingresada, fecha_vencimiento, codigo_factura, costo_total, costo_unitario, porcentaje_venta) {
        this._id_producto = id_producto;
        this._cantidad_ingresada = cantidad_ingresada;
        this._fecha_vencimiento = fecha_vencimiento;
        this._codigo_factura = codigo_factura;
        this._costo_total = costo_total;
        this._costo_unitario = costo_unitario;
        this._porcentaje_venta = porcentaje_venta;
    }
    // Getters
    get id_producto() {
        return this._id_producto;
    }
    get cantidad_ingresada() {
        return this._cantidad_ingresada;
    }
    get fecha_vencimiento() {
        return this._fecha_vencimiento;
    }
    get codigo_factura() {
        return this._codigo_factura;
    }
    get costo_total() {
        return this._costo_total;
    }
    get costo_unitario() {
        return this._costo_unitario;
    }
    get porcentaje_venta() {
        return this._porcentaje_venta;
    }
    // Setters
    set id_producto(id_producto) {
        this._id_producto = id_producto;
    }
    set cantidad_ingresada(cantidad_ingresada) {
        this._cantidad_ingresada = cantidad_ingresada;
    }
    set fecha_vencimiento(fecha_vencimiento) {
        this._fecha_vencimiento = fecha_vencimiento;
    }
    set codigo_factura(codigo_factura) {
        this._codigo_factura = codigo_factura;
    }
    set costo_total(costo_total) {
        this._costo_total = costo_total;
    }
    set costo_unitario(costo_unitario) {
        this._costo_unitario = costo_unitario;
    }
    set porcentaje_venta(porcentaje_venta) {
        this._porcentaje_venta = porcentaje_venta;
    }
}
;
exports.default = StockDto;
