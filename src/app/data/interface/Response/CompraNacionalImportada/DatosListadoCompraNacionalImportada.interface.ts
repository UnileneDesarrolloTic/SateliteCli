
export interface DatosCompraNacionalImportada {
    material:             string;
    itemFinal:            string;
    descripcionLocal:     null | string;
    familiaLarga:         string;
    tiempoCompra:         number;
    tiempoPago:           number;
    tiempoAprobacion:     number;
    tiempofabricacion:    number;
    tiempoTransporte:     number;
    tiempoAduanas:        number;
    cantidadMinima:       number;
    pronostico:           number;
    variacion:            number;
    demoraLlegarProducto: number;
    consumoDia:           number;
    desviacionCompra:     number;
    pendienteOC:          number;
    preparacionOC:        number;
    controlCalidad:       number;
    aduanas:              number;
    almacen:              number;
    disponible:           number;
    planta:               number;
    diasPotencial:        number;
    puntoCorte:           number;
    maximoStock:          number;
    diasEspera:           number;
    cantidadComprar:      number;
    gestionColor:         string;
    idGestion:            number;
}