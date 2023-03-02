export interface OrdeCompraSimulada {
    cabecera: CabeceraOrdenCompraP;
    detalle:  DetalleOrdenCompraP[];
}

export interface CabeceraOrdenCompraP {
    Proveedor:            number;
    DescripcionProveedor: string;
    Procedencia:          string;
    MonedaCodigo:         string;
    FechaPreparacion:     Date;
    MontoTotal:           number;
    Estado:               string;
}

export interface DetalleOrdenCompraP {
    proveedor:      number;
    Secuencia:      number;
    Item:           string;
    Descripcion:    string;
    Presentacion:   string;
    CantidadPedida: number;
    PrecioUnitario: number;
    MontoTotal:     number;
    Moneda:         string;
    Estado:         string;
    FechaPrometida: Date;
}