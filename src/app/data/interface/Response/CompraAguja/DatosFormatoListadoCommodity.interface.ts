
export interface ConfigComodity {
    material:             string;
    itemFinal:            string;
    descripcionLocal:     string;
    clasificacion:        string;
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
    almacen:              number;
    disponible:           number;
    diasPotencial:        number;
    puntoCorte:           number;
    maximoStock:          number;
    diasEspera:           number;
    cantidadComprar:      number;
    gestionColor:         string;
    idGestion:            number;
}