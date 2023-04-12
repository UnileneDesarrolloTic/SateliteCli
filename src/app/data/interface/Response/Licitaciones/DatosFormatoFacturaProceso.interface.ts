export interface informacionFacturaProceso {
    numeroDocumento: string | null;
    fechaDocumento:  Date;
    proceso:         string | null;
    ordenCompra:     string | null;
    montoTotal:      number;
    cantidad:        number;
}