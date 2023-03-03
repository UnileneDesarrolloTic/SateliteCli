export interface MostrarOrdenCompraDrogueria {
    numeroOrden:        string;
    proveedor:          string;
    cantidadPedida:     number;
    cantidadRecibida:   number;
    cantidadKardex:     number;
    cantidadTransito:   number;
    fechaPreparacion:   Date;
    tiempoGeneral:      number;
    nuevoTiempoEntrega: Date;
    diasFalta:          number;
}