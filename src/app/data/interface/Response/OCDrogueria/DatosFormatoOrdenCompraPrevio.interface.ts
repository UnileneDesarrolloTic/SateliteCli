export interface OrdenCompraPrevio {
    proveedor:            number;
    clasificacion:        string;
    descripcionProveedor: string;
    procedencia:          string;
    monedaCodigo:         string;
    fechaPreparacion:     Date;
    montoTotal:           number;
    estado:               string;
}