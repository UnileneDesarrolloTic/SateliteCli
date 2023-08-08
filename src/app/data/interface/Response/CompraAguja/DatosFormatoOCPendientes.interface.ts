export interface OCPendientesArima {
    secuencia:         number;
    item:              string;
    numeroOrden:       string;
    proveedor:         string;
    cantidad:          number;
    cantidadRecibidad: number;
    pendienteOC:       number;
    fechaPreparacion:  Date;
    fecha:             Date;
    diferenciaFecha:   number;
    fechaLlegada:       Date;
}