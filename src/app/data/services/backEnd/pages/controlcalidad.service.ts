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

  ObtenerInformacionLote(NumeroLote){
    const params =  new HttpParams().set('NumeroLote', NumeroLote)
    return this._http.get<any>(this.url+"/api/ControlCalidad/ObtenerInformacionLote", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Orden Fabicacion"))
    );
  }

  ObtenerTransaccion(OrdenFabricacion,codAlmacen){
    const params =  new HttpParams().set('NumeroLote', OrdenFabricacion).set('codAlmacen',codAlmacen);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarTransaccionItem", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }

  RegistrarLoteNumeroCaja(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/RegistrarLoteNumeroCaja", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }


  ListarKardexInternoGCM(NumeroLote){
    const params =  new HttpParams().set('NumeroLote', NumeroLote);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarKardexInternoNumeroLote", {'params':params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }

  RegistrarKardexInternoGCM(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/RegistrarKardexInternoGCM", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }

  ActualizarKardexInternoGCM(idKardex,comentarios){
    const params =  new HttpParams().set('idKardex', idKardex).set('comentarios',comentarios);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ActualizarKardexInternoGCM", {'params':params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }




  ExportarOrdenFabricacionCaja(){
    return this._http.get<any>(this.url+"/api/ControlCalidad/ExportarOrdenFabricacionCaja").pipe(
      catchError (() => throwError("Error al obtener Datos Exportar Caja"))
    );
  }

}
