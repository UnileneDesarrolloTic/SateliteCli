export interface DatosClienteResponse
{
    documento: string,
    nombre: string,
    territorio: string,
    pais: string,
    estado: string
}

export interface RegistrarReclamoResp
{
    codigoReclamo: string,
    fechaRegistro: Date
}

export interface ConfiguracionSistemaDetalle 
{
    idConfiguracion: number,
    id:number,
    grupo: string,
    valorTexto1: string,
    valorTexto2: string,
    valorEntero1?: number,
    valorEntero2?: number,
    valorEntero3?: number,
    valorDecimal1?: number,
    valorDecimal2?: number,
    valorDecimal3?: number,
    valorFecha1?: Date,
    valorFecha2?: Date,
    valorFecha3?: Date,
    valorBit?: boolean,
    estado: string
}