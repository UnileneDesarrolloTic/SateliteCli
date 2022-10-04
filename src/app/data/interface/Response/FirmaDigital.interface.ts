import { Paginado } from "@data/interface/Comodin/Paginado.interface"

export interface SolicitudFirmaDigital
{
    id:number,
    flujo:string,
    asunto:string,
    estado: string,
    estadoDes: string,
    usuario:string,
    fecha:Date
}

export interface ResponseListarSolicitud
{
    paginado: Paginado,
    lista: SolicitudFirmaDigital[]
}
  
export interface FiltrosSolitud 
{
    flujo: number,
    estado: string,
    asunto: string,
    fecha?: Date,
    pagina: number,
    registrosPorPagina: number
}

export interface DocumentoSolicitud 
{
    flagSelect: boolean,
    id: number,
    tipoDocumento: string,
    nombreArchivo: string,
    nombreDocumento: string,
    tamanoDocumento: number,
    formatoDocumento: string,
    estadoDocumento: string,
    estadoDocumentoDes: string,
    codUsuario: number,
    usuario: string,
    codUsuarioFirma: string,
    usuarioFirma: string,
    estadoFirma: string,
    estadoFirmaDes: string,
    rutaDocumento: string
}

export interface TipoDocumento
{
    id: number,
    tipoDocumento: string,
    formatoDocumento: string,
    pesoMaximo: number
}

export interface SolicitudPendienteFirma
{
    id:number,
    flujo:string,
    asunto:string,
    estado: string,
    usuario:string,
    fecha:Date
}


export interface ResposeSolicitudPendienteFir
{
    paginado: Paginado,
    lista: SolicitudPendienteFirma[]
}

export interface DocumentosPendientesFirma
{
    flagSelect: boolean,
    idDocumento: number,
    tipoDocumento: string,
    nombreArchivo: string,
    nombreDocumento: string,
    usuarioSoicitud: string,
    fechaSolicitud: Date
}