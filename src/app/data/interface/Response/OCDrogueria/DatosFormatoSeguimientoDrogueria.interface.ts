export interface ModelSeguimientoDrogueria {
  idProveedor:         number;
  ordenAgrupador:      number;
  descProveedor:       string;
  puerto:              string;
  periodo:             string;
  item:                string;
  descripcionLocal:    string;
  unidadCodigo:        string;
  volumenCaja:         number;
  variacion:           number;
  pronostico:          number;
  diasAdicionales:     number;
  tiempoTotal:         number;
  tiempoGeneral:       number;
  consumoDiario:       number;
  tFabricacion:        number;
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
  diasEspera:          number;
  puntoCorteDebePagar: number;
  maximoStock:         number;
  cantidadComprar:     number;
  totalComprar:        number;
  precioFOBFinal:      number;
  precioFOBTotalFinal: number;
  colorVariacion:      string;
  idGestionarColor:    number;
  }
  