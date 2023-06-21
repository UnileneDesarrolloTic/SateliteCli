export interface OCPendientesArimaNacionalImportado {
    item:              string;
    numeroOrden:       string;
    proveedor:         string;
    cantidad:          number;
    cantidadRecibidad: number;
    pendienteOC:       number;
    fecha:             Date;
    diferenciaFecha:   number;
    fechaLlegada:       Date;
}