export interface DatosGuiaPorFacturarModel {
    serieNumero: string ,
    guiaNumero: string,
    destinatario: number,
    destinatarioRUC: string,
    destinatarioNombre: string,
    fechaDocumento: Date,
    estadoGuia: string,
    facturaNumero: string,
    facturaFecha: string,
    estadoFacturacion: string,
    destinatarioDireccion: string,
    referenciaNumeroOrden: string,
    ultimoUsuario: string,
    comentarioGuia: string,
    reprogramacionPuntoPartida: string,
    estadoLogistica: string,
    licitacionNumeroProceso: string,
    comentariosEntrega:boolean; 
    usuComercial:string;// ENTREGA
  }
  