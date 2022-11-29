
export interface ListarCotizacionExportacionModel {
    clienteNombre:string,
    clienteNumero:number,
    comentarios:string,
    companiaSocio:string,
    descripcionEstado:string,
    descripcionMoneda:string,
    estado:string,
    fechaDocumento:Date;
    montoAfecto:number;
    montoDescuentos:number;
    montoNoAfecto:number;
    montoTotal:number;
    numeroDocumento:string;
    preparadoPor_Nombre:string;
    sucursal:string;
    tipoCliente:string;
    tipoVenta:string;
    vendedor:number;
}
  