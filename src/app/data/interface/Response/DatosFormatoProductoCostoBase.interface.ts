export interface DatosFormatoProductoCostoBaseModel {
    
    codigoItem: string,
    descripcionLocal: string,
    numeroDeParte:string,
    linea:string,
    familia:string,
    subfamilia:string,
    codMoneda:string,
    costoMateriaPrima:number,
    costoManoObra:number,
    costoCIF:number,
    costoUnitarioBase:number,
    precioVentaMinimo:number,
    ultFechaDoc:string,
    itemComponente:string,
    descripcionLocalItemComponente:string,
    itemComponenteCostoDolares:number,
    itemComponenteCostUnitario:number,
    lineaItemComponente:string,
    familiaItemComponente:string,
    subFamiliaItemComponente:string,
    tipoAguja:string,
    isSelected:boolean,
    
  }
  