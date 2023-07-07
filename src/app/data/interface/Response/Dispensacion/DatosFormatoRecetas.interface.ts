
export interface RecetasDispensacion {
    secuencia:          number;
    documento:          string;
    itemInsumo:         string;
    descripcionLocal:   string;
    itemTipo:           string;
    unidadCodigo:       string;
    cantidadGeneral:    number;
    tipoMP:             string;
    cantidadSolicitada: number;
    cantidadDespachada: number;
    cantidadIngresada:  number;
    lote:               string;
    entregadoPor:       number;
    recibidoPor:        string;
}
