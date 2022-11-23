import { Paginado } from "@data/interface/Comodin/Paginado.interface";

export interface ReclamosQuejasPaginado
{
    paginado: Paginado,
    contenido: ReclamosQuejas[]
    
}

export interface ReclamosQuejas
{
    codReclamo: string,
    nombreCliente: string,
    tipoCliente: string,
    nacionalidad: string,
    territorio: string,
    estado: string,
    fechaRegistro: Date,
    usuarioRegistro: string,
    diferenciaDias: number
}

export interface LotesFiltradosReclamo
{
    fechaDocumento: Date,
    codTipoDocumento:string,
    tipoDocumento: string,
    numeroDocumento: string,
    lote: string,
    ordenFabricacion: string,
    item: string,
    descripcion: string,
    cantidadPedida: number,
    cantidadEntregada: number
    precioUnitario: number,
    montoTotal: number
}

export interface FiltrosLotesReclamos
{
    cliente: number,
    tipoFiltro: string,
    valorFiltro: string
}

export interface CabeceraDetalleReclamo
{
    cliente: number,
    fechaRegistro: Date,
    razonSocial: string,
    documento: string,
    pais: string,
    territorio: string
    estado: string
}

export interface DetalleReclamo 
{
    documento: string,
    lote: string,
    ordenFabricacion: string,
    linea: string,
    familia: string,
    item: string,
    descripcionItem: string,
    marca: string,
    cantidad: number,
    estado: string
    usuarioRegistro: string,
    fechaRegistro: Date
}

export interface DatosReclamo
{
    cabecera: CabeceraDetalleReclamo
    detalle: DetalleReclamo[]
}

export interface DatosItemPorLote 
{
    item: string,
    descripcionLocal: string,
    linea: string,
    familia: string,
    subFamilia: string,
    marca: string
}

export interface TBDReclamoEntity 
{
    idDetalle: number,
    codReclamo: string,
    lote: string,
    ordenFabricacion: string,
    tipoDocumento: string,
    documento: string,
    motivo: string,
    solicitud: string,
    fechaIncidencia: Date,
    clasificacion?: number,
    areaInvolucrada?: number,
    cantidad: number,
    observaciones: string,
    estado: string,
    usuarioRegistro: string,
    fechaRegistro: Date
}

export interface CabeceraLoteReclamo 
{
    id: number,
    ordenFabricacion: string,
    fechaDocumento: Date,
    codTipoDocumento: string,
    tipoDocumento: string,
    documento: string,
    item: string,
    descripcion: string,
    linea: string, 
    familia: string, 
    subFamilia: string,
    marca: string,
    cantidadPedida: number,
    cantidadEntregada: number,
    precioUnitario: number,
    monto: number,
    motivo: string,
    remitente: string,
    reingreso: boolean,
    porCarta: boolean,
    solicitud: string,
    fechaIncidencia: Date,
    clasificacion: number,
    areaInvolucrada: number,
    cantidad: number,
    observaciones: string
    estado: string,
    tipoEnvioRespuesta : string,
    destinatarioRespuesta : string,
    loteCanjeRespuesta : string,
    respuesta : string,
    usuarioRespuesta : string,
    fechaRespuesta : Date
}

export interface EvidenciaLoteReclamo 
{
    id: number,
    nombreArchivo: string,
    nombreDocumento: string,
    tamanoDocumento: number,
    formatoDocumento: string,
    rutaArchivo: string,
    usuario: string,
    fecha: Date
}