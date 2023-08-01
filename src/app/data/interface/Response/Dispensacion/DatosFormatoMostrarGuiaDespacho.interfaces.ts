
export interface InformacionDispensacionGuiaDespacho {
    idDispensacion:     number;
    ordenFabricacion:   string;
    itemTerminado:      string;
    item:               string;
    descripcionLocal:   string;
    documento:          string;
    secuencia:          number;
    lote:               string;
    cantidadIngresada:  number;
    usuarioCreacion:    string;
    fechaRegistro:      Date;
    cantidadSolicitada: number;
}