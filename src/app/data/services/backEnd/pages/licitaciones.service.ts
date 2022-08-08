import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { DetallePedido } from '@data/interface/Response/ListarDetallePedido.interface';
import { DatosListarProceso } from '@data/interface/Response/DatoListarProceso.interface';

@Injectable({
  providedIn: 'root'
})
export class LicitacionesService {
  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { 
  }

  ListarProceso(){
    
    return this._http.get<DatosListarProceso[]>(this.url+"/api/Licitaciones/ListarProceso").pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }

  ListarDetallePedido(Pedido){
    const params =  new HttpParams().set('Pedido', Pedido)
    return this._http.get<DetallePedido[]>(this.url+"/api/Licitaciones/ListaDetallePedido", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }

  ListarDistribuccionLP(itemBusqueda){
    const params = new HttpParams().set('NumeroProceso',itemBusqueda.NumeroProceso).set('Item',itemBusqueda.Item).set('Mes',itemBusqueda.Mes);
    return this._http.get<DetallePedido[]>(this.url+"/api/Licitaciones/ListarDistribuccionProceso", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }

  RegistrarDistribuccionLP(body){
    return this._http.post(this.url+"/api/Licitaciones/RegistrarDistribuccionProceso", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }

  ListarProgramacionMuestrasLIP(itemBusqueda){
    const params = new HttpParams().set('IdProceso',itemBusqueda.IdProceso).set('NumeroEntrega',itemBusqueda.NumeroEntrega);
    return this._http.get<DetallePedido[]>(this.url+"/api/Licitaciones/ListarProgramaMuestraLIP", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }

  RegistrarProgramacionMuestreoLIP(body){
    return this._http.post(this.url+"/api/Licitaciones/RegistrarProgramacionMuestreo", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }


  ListarGuiaInfomeLP(ItemBusqueda){
    const params = new HttpParams().set('NumeroEntrega',ItemBusqueda.NumeroEntrega).set('OrdenCompra',ItemBusqueda.OrdenCompra);
    return this._http.get<DetallePedido[]>(this.url+"/api/Licitaciones/ListarGuiaInformacion", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }

  ListarContratoProceso(proceso){
    const params = new HttpParams().set('proceso',proceso);
    return this._http.get<DetallePedido[]>(this.url+"/api/Licitaciones/ListarContratoProceso", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }

  RegistrarContratoProceso(body){
    return this._http.post(this.url+"/api/Licitaciones/RegistrarContratoProceso", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }


  ExportarDashboardLicitaciones(){
    return this._http.get(this.url+"/api/Licitaciones/DashboardLicitacionesExportar").pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }
}
