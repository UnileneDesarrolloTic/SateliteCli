
export interface Paginado {
  paginaActual: number,
  totalPaginas: number,
  registroPorPagina: number,
  totalRegistros: number,
  siguiente:boolean,
  anterior: boolean,
  primeraPagina: boolean,
  ultimaPagina: boolean
}
