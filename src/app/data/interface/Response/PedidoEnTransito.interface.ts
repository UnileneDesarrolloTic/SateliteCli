export interface PedidoEnTransito {
  pedidoNumero : string,
  numeroLote: number,
  item: string,
  cantidadPedida: number,
  cantidadIngresada: number,
  cantidadPendiente:number,
  fechaPreparacion:Date,
  difDias: number
}
