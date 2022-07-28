import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ControlcalidadService {
  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { 
  }

  ObtenerOrdenFabricacion(OrdenFabricacion){
    const params =  new HttpParams().set('NumeroLote', OrdenFabricacion)
    return this._http.get<any>(this.url+"/api/ControlCalidad/OrdenFabricacion", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Orden Fabicacion"))
    );
  }

  ObtenerTransaccion(NumeroLote,codAlmacen){
    const params =  new HttpParams().set('NumeroLote', NumeroLote).set('codAlmacen',codAlmacen);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarTransaccionItem", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }

  RegistrarOrdenFabricacionCaja(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/RegistrarOrdenFabricacionCaja", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }

  ExportarOrdenFabricacionCaja(){
    return this._http.get<any>(this.url+"/api/ControlCalidad/ExportarOrdenFabricacionCaja").pipe(
      catchError (() => throwError("Error al obtener Datos Exportar Caja"))
    );
  }

}
