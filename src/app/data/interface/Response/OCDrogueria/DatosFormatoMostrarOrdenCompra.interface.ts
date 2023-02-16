export interface MostrarOrdenCompraDrogueria {
    numeroOrden:       string;
    proveedor:         string;
    cantidad:          number;
    cantidadRecibida:  number;
    cantidadPendiente: number;
    fechaPrometida:    Date;
    diferenciaFecha:   number;
}