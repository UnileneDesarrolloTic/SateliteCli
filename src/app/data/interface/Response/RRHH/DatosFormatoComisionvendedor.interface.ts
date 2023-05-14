export interface comisionvendedorModel {
    cobrador:            number;
    nombreCompleto:      string;
    totalFacturado:      number;
    sinIGV:              number;
    ventaGeneral:        number;
    ventaRestriccion:    number;
    ventaGuantes:        number;
    ventaEmodialisis:    number;
    comisionGeneral:     number;
    comisionRestriccion: number;
    comisionGuantes:     number;
    comisionEmodialisis: number;
    comisionTotal:       number;
}