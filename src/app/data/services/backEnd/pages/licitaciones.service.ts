import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, Subscriber, Subscription, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { DetallePedido } from '@data/interface/Response/ListarDetallePedido.interface';
import { DatosListarProceso } from '@data/interface/Response/DatoListarProceso.interface';
import { DatosContratoProcesos } from '@data/interface/Response/Agrupados/Licitaciones.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LicitacionesService {
  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient, private _toastr: ToastrService) { 
  }

  ListarProceso(idClient):Observable<DatosListarProceso[]>
  {
    const params =  new HttpParams().set('idClient', idClient)
    return this._http.get<DatosListarProceso[]>(this.url+"/api/Licitaciones/ListarProceso", {'params': params}).pipe(
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

  ListarTipoUsuario(itemBusqueda){
    const params = new HttpParams().set('NumeroProceso',itemBusqueda.IdProceso).set('Item',itemBusqueda.Item).set('Mes',itemBusqueda.NumeroEntrega);
    return this._http.get(this.url+"/api/Licitaciones/ObtenerTipoUsuario", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }

  BuscarOrdenCompraLicitaciones(itemBusqueda){

    const params = new HttpParams().set('NumeroProceso',itemBusqueda.IdProceso).set('NumeroEntrega',itemBusqueda.NumeroEntrega).set('Item',itemBusqueda.Item).set('TipoUsuario',itemBusqueda.TipoUsuario);
    return this._http.get(this.url+"/api/Licitaciones/BuscarOrdenCompraLicitaciones", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Registrar Orden Compra"))
    );
  }

  RegistrarOrdenCompra(body){
    return this._http.post(this.url+"/api/Licitaciones/RegistrarOrdenCompra", body).pipe(
      catchError (() => throwError("Error al obtener Registrar Orden Compra"))
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

  ListarContratoProceso(proceso):Observable<DatosContratoProcesos[]>{
    const params = new HttpParams().set('proceso',proceso);
    return this._http.get<DatosContratoProcesos[]>(this.url+"/api/Licitaciones/ListarContratoProceso", {'params': params}).pipe(
      catchError (_ => throwError("Error al obtener Detalle de Pedido"))
    );
  }

  RegistrarContratoProceso(body){
    return this._http.post(this.url+"/api/Licitaciones/RegistrarContratoProceso", body).pipe(
      catchError (_ => 
      {
        this._toastr.error("Ocurrio un error al guardas los contratos", "Error !!", {closeButton: true, progressBar: true, timeOut: 3000})
        return throwError("Error al obtener Detalle de Pedido")
      })
    );
  }


  exportarDashboardLicitaciones(opcion){
    const params = new HttpParams().set('opcion',opcion);
    return this._http.get(this.url+"/api/Licitaciones/DashboardLicitacionesExportar",{'params': params}).pipe(
      catchError (_ => 
        {
          this._toastr.error("Error al descargar el excel", "Error !!", {closeButton: true, progressBar: true, timeOut: 3000})
          return throwError("Error al descargar el excel")
        })
    );
  }

}
