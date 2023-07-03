export interface MostrarOrdenCompraDrogueria {
    descripcion:        string;
    itemFinal:          string;
    numeroOrden:        string;
    proveedor:          string;
    cantidadPedida:     number;
    cantidadRecibida:   number;
    fechaPreparacion:   Date;
    tiempoGeneral:      number;
    nuevoTiempoEntrega: Date;
    diasFalta:          number;
    fechaPrometida:     Date;
}