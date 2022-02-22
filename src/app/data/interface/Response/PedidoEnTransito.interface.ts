export interface PedidoEnTransito {
  lote: number,
  item: string,
  cantidadPedida: number,
  cantidadIngresada: number,
  cantidadPendiente:number,
  fechaPreparacion:Date,
  difDias: number
}
