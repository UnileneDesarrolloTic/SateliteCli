export interface TablaPruebasModel {
    iD_PRUEBA: number ,
    iD_AGRUPADOR_HEBRA: number,
    iD_METODOLOGIA: number,
    calibrE_USP: string,
    unidaD_MEDIDA: string,
    valor: number,
    fechA_REGISTRO: Date,
    usuario: string,
    estado: string,
    version: string,
    iD_PRUE: number,
    especifficacionlocal: string,
    especifficacioningles: string,
    iD_ESPECIFICACION: number,
    mostrar: number,
    cant_decimales: number,
    iD_MARCA: string,
    descripcionlocal:boolean; 
    descripcioningles:string;
    descripcionAgrupador:string,
    descripcionMetodologia:string,
    descripcionCalibre:string;
  
  }
  