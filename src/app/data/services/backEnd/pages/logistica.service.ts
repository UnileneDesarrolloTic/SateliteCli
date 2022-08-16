import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class LogisticaService {
  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { 
  }

  ObtenerNumeroGuia(NumeroGuia){
    const params = new HttpParams().set('NumeroGuia',NumeroGuia);
   
    return this._http.get<any[]>(this.url+"/api/Logistica/ObtenerNumeroGuias", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Numeros de guia"))
    );
  }

  RegistarFechaRetorno(body){
    return this._http.post<any[]>(this.url+"/api/Logistica/RegistrarRetornoGuia", body).pipe(
      catchError (() => throwError("Error al obtener Numeros de guia"))
    );
  }


  ListarItemVentas(body){
    return this._http.post<any[]>(this.url+"/api/Logistica/ListarItemVentas",body).pipe(
      catchError (() => throwError("Error al obtener Listar Item Ventas"))
    );
  }

  BuscarItemVentas(Item){
    const params = new HttpParams().set('Item',Item);
    return this._http.get<any[]>(this.url+"/api/Logistica/BuscarItemVentas", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Buscar Item Ventas"))
    );
  }

  ListarItemVentasExportar(body){
    return this._http.post<any[]>(this.url+"/api/Logistica/ListarItemVentasExportar",body).pipe(
      catchError (() => throwError("Error al obtener Buscar Item Ventas"))
    );
  }

  ListarItemVentasDetalle(){
    return this._http.get<any[]>(this.url+"/api/Logistica/ListarItemVentasDetalle").pipe(
      catchError (() => throwError("Error al obtener Buscar Item Ventas Detalle"))
    );
  }

  DetalleComprometidoItem(body){
    return this._http.post<any[]>(this.url+"/api/Logistica/DetalleComprometidoItem",body).pipe(
      catchError (() => throwError("Error al obtener Buscar Item Ventas Detalle Comprometido"))
    );
  }

  ListarItemVentasDetalleExportar(){
    return this._http.get<any[]>(this.url+"/api/Logistica/ListarItemVentasDetalleExportar").pipe(
      catchError (() => throwError("Error al obtener Buscar Item Ventas Detalle Comprometido Export"))
    );
  }
}
