import { DetalleCalidad } from "./DetalleCalidad.interface";
import { DetalleOrdenCompraMP } from "./DetalleordenCompraMPArima";

export interface ComprasMateriaPrimaArima {
    periodo: string,
    item: string,
    codFamilia: string,
    familiaMP:string,
    coeficienteVariacion: number,
    descripcion:string,
    kraljic:number,
    meses:number,
    promedioanual: number,
    promedioHist: number,
    pronostico: number,
    limiteSuperior: number,
    maximo:number,
    puntoControl: number,
    controlCalidad: number,
    aduanas: number,
    pendienteOC: number,
    stockDisponible: number,
    stockReal: number,
    alerta: number,
    duracion:number,
    condicionColor: string,
    detalleCompra:DetalleOrdenCompraMP[],
    detalleCalidad:DetalleCalidad[]
  }
  