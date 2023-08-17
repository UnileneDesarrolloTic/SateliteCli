export interface DispensacionDetalleGlobal {
    ordenFabricacion:   string;
    numeroLote:         string;
    itemTerminado:      string;
    secuencia:          number;
    documento:          string;
    descripcionLocal:   string;
    itemInsumo:         string;
    itemTipo:           string;
    unidadCodigo:       string;
    cantidadGeneral:    number;
    cantidadSolicitada: number;
    cantidadDespachada: number;
    tipoMP:             string;
    lote:               null | string;
    nombresubFamilia:   string;
    codigoSubFamilia:   string;
    entregadoPor:       number;
    recibidoPor:        string;
    cantidadIngresada:  number;
}