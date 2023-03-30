export interface DatosListarRetornoGuia
{
            serieNumero: string ,
            guiaNumero: string,
            cliente: string,
            fechaDocumento: Date,
            numeroOrden: string,
            licitacionNumeroProceso: string,
            reprogramacionPuntoPartida:string,                                         
            retornoAlmacen: string,
            retornoComercial: string,
            fechaRecepcion: Date,
            fechaRetornoComercial: Date,
            fechaRetornoAlmacen: Date,
            diasAtrasoAlmacen: number,
            diasAtrasoComercial: number,
            destino: string,
            transportista: string,
            monto: number
}