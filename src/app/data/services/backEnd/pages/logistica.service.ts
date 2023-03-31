import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class LogisticaService {
  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient,private _toastr: ToastrService) { 
  }

  ObtenerNumeroGuia(NumeroGuia){
    const params = new HttpParams().set('numeroguia',NumeroGuia);
   
    return this._http.get<any[]>(this.url+"/api/Logistica/ObtenerNumeroGuias", {'params': params}).pipe(
      catchError (() => {
        this._toastr.error("Error al buscar la guia  ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al buscar la guia ")
      })
    );
  }

  RegistarFechaRetorno(body){
    return this._http.post<any[]>(this.url+"/api/Logistica/RegistrarRetornoGuia", body).pipe(
      catchError (() => throwError("Error al obtener Numeros de guia"))
    );
  }

  listadoRetornoGuia(body){
    return this._http.post(this.url+"/api/Logistica/ListarRetornoGuia",body).pipe(
      catchError( _ => {
        this._toastr.error("Error al listar informacion retorno de guia ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al listar informacion retorno de guia ")
      })
    );
  }

  exportarExcelRetornoGuia(body){
    return this._http.post(this.url+"/api/Logistica/ExportarExcelRetornoGuia",body).pipe(
      catchError( _ => {
        this._toastr.error("Error al exportar información retorno de guia ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al exportar información retorno de guia ")
      })
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

  ListarNumeroDePedido(NumeroDocumento,Tipo){
    const params = new HttpParams().set('NumeroDocumento',NumeroDocumento).set('Tipo',Tipo);
    return this._http.get<any[]>(this.url+"/api/Logistica/BuscarNumeroPedido",{'params': params}).pipe(
      catchError (() => throwError("Error al obtener Buscar Numero de pedido"))
    );
  }

  ListarDetalleReceta(Item,Cantidad){
    const params = new HttpParams().set('Item',Item).set('Cantidad',Cantidad);
    return this._http.get<any[]>(this.url+"/api/Logistica/BuscardDetalleRecetaMP",{'params': params}).pipe(
      catchError (() => throwError("Error al obtener Buscar Numero de pedido"))
    );
  }
  
  
}
