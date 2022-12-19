export interface DatosAnalisisAgujaFlexion
{
  cabecera: {
    idAnalisis:number,
    controlNumero:string,
    ordenCompra:string,
    item:string,
    descripcionItem:string,
    codProveedor:number,
    proveedor:string,
    cantidadPruebas:number,
    especialidad:string,
    fechaAnalisis:Date
  },
  detalle: {
    lote:string,
    tipoRegistro:string,
    llave:string,
    valor:string,
    usuarioRegistro:string,
    fechaRegistro:string,
  }[],
}
