
export interface HistorialDispensacion {
    documento:          string;
    secuencia:          number;
    item:               string;
    lote:               string;
    cantidadIngresada:  number;
    cantidadSolicitada: number;
    usuarioCreacion:    string;
    fechaRegistro:      Date;
}