export interface InformacionEquipo {
    cabecera: Cabecera;
    detalle:  Detalle[];
}

export interface Cabecera {
    idEquipo:       number;
    descripcion:    string;
    tipo:           string;
    idPersona:      number;
    estado:         string;
    nombreCompleto: string;
}

export interface Detalle {
    seleccionar:               boolean;
    id:                        number;
    codigo:                    string;
    dado:                      string;
    alambre:                   string;
    tipo:                      string;
}
