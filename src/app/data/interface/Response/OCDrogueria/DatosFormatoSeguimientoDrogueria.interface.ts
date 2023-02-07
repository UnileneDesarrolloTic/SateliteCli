export interface ModelSeguimientoDrogueria {
    idProveedor:         number;
    descProveedor:       string;
    puerto:              string;
    periodo:             string;
    item:                string;
    volumenCaja:         number;
    variacion:           number;
    pronostico:          number;
    diasAdicionales:     number;
    consumoDiario:       number;
    variableItem:        number;
    tGestionCompra:      number;
    tGestionPago:        number;
    tGestionAprobacion:  number;
    transporte:          number;
    tAduanas:            number;
    mesesAdicional:      number;
    stockAlmacenDRO:     number;
    cantidadOC:          number;
    totalStock:          number;
    futuroStock:         number;
    puntoCorteDebePagar: number;
    maximoStock:         number;
  }
  