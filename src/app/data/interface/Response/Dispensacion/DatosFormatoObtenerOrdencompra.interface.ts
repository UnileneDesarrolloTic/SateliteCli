export interface ObtenerOrdneFabricacion {
    ordenFabricacion:   string;
    lote:               string;
    fechaProduccion:    Date;
    fechaExpiracion:    Date;
    item:               string;
    numerodeparte:      string;
    descripcionLocal:   string;
    busqueda:           string;
    cantidadProgramada: number;
    cantidadPedida:     number;
    cantidadMuestra:    number;
    cantidadProducida:  number;
    estado:             string;
    referenciaTipo:     string;
    cliente:            number;
    transferidoFlag:    string;
    comentarios:        null;
    fechaEntrega:       Date;
    fechaRequerida:     Date;
    pedidoNumero:       string;
    multipedido:        number;
    fechaProgramadaInicio: Date;
    secuencia:          number;
}