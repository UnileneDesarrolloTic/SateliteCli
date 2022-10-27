export interface DatosFormatoProductoCostoBaseModel {
    
    codigoItem: string,
    descripcionLocal: string,
    numeroDeParte:string,
    linea:string;
    familia:string;
    subfamilia:string,
    codMoneda:string,
    costoMateriaPrima:number;
    costoManoObra:number;
    costoCIF:number;
    costoUnitarioBase:number;
    ultFechaDoc:string,
  }
  