export interface TransportistaModel {
    id:              number;
    descripcion:     string;
    direccion:       string | null;
    primerTelefono:  null | string;
    segundoTelefono: null | string;
    estado:          string;
}
