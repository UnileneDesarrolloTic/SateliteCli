import { CabeceraPantillaCotizacion } from "./CabeceraPantillaCotizacion.interface";
import { DetallePantillaCotizacion } from "./DetallePantillaCotizacion.interface";

export interface Cotizacion {
    cabecera:CabeceraPantillaCotizacion[];
    detalle:DetallePantillaCotizacion[]
  }
  