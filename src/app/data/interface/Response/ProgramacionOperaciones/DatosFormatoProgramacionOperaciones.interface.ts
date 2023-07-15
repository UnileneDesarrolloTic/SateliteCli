export interface ProgramacionOperacionesOrdenFabricacion {
    id:                    number;
    fechaRegistro:         Date;
    ordenFabricacion:      string;
    lote:                  string;
    fechaProduccion:       Date;
    fechaExpiracion:       Date;
    item:                  string;
    numerodeparte:         string;
    descripcionLocal:      string;
    busqueda:              string;
    cantidadProgramada:    number;
    cantidadPedida:        number;
    cantidadMuestra:       number;
    cantidadProducida:     number;
    estado:                string;
    referenciaTipo:        string;
    cliente:               number;
    comentarios:           string;
    fechaInicio:           Date | null;
    fechaEntrega:          Date | null;
    fechaRequerida:        Date | null;
    pedidoNumero:          string;
    codigoAgrupador:       number;
    agrupador:             string;
    clasificacionGerencia: string;
}