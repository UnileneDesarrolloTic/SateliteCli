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
    IdGestionarColor:     number;
    DiasEspera:           number;
    FechaPrometida:       Date;
    ViaEnvio:             string;
    Incoterms:            string;
    PaisOrigen:           string;
    PuertoSalida:         string;
}

export interface DetalleOrdenCompraP {
    Proveedor:      number;
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
    ColorVariacion:   string;
    IdGestionarColor: number;
}