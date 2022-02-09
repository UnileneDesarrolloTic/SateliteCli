import { PedidoEnTransito } from "./PedidoEnTransito.interface";

export interface SeguimientoCandidato {
  candidato : number,
  codSut: string,
  item : string,
  regla: string,
  descripcion : string,
  coeficienteVariacion : number,
  pronostico : number,
  limiteSuperior : number,
  puntoControl: number,
  stockMax : number,
  stockDisponible : number,
  stockEnTransito : number,
  alerta : number,
  pedidoAtrasado : boolean,
  pedidosTransito: PedidoEnTransito[]
}
