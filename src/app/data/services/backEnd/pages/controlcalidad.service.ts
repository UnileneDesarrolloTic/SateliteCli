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

  ExportarOrdenFabricacionCaja(anioProduccion){
    const params =  new HttpParams().set('anioProduccion', anioProduccion);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ExportarOrdenFabricacionCaja",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Datos Exportar Caja"))
    );
  }


  ListarControlLotes(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/ListarControlLotes", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de listar de control lote "))
    );
  }


  ListarTablaNumeroParte(Grupo,Tabla){
    const params =  new HttpParams().set('Grupo', Grupo).set('Tabla',Tabla);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarMaestroNumeroParte",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Tabla de  Numero de Parte"))
    );
  }

  ListarTablaAtributo(){
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarAtributos").pipe(
      catchError (() => throwError("Error al obtener Tabla de Atributo"))
    );
  }

  ListarTablaDescripcion(Marca,Hebra){
    const params =  new HttpParams().set('Marca', Marca).set('Hebra',Hebra);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarDescripcion",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Tabla de Atributo"))
    );
  }

  ListarTablaLeyenda(Marca,Hebra){
    const params =  new HttpParams().set('Marca', Marca).set('Hebra',Hebra);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarLeyenda",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Tabla de Atributo"))
    );
  }


  ActualizarControlLotes(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/ActualizarControlLotes", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de listar de control lote "))
    );
  }
}
