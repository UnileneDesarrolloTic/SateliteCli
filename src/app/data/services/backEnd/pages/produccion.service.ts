import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ComprasMateriaPrimaArima } from '@data/interface/Response/CompraMateriaPrimaArima';


@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { }

  ListarProductosArima(periodo: string){

    const params = new HttpParams().set('periodo', periodo)

    return this._http.get<SeguimientoCandidato[]>(this.url+"/api/Produccion/ProductosArima", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  ListSeguimientoCandidatosMateriaPrima(regla){
    const params =  new HttpParams().set('regla', regla)

    return this._http.get<SeguimientoCandidato[]>(this.url+"/api/Produccion/SegimientoCandidatosMP", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  ListaPedidosCreadosAutomaticoLog(body){
    return this._http.post(this.url + "/api/Produccion/ListaPedidosCreadoAuto", body).pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }
  ListaCompraMP(CompraMp){
    return this._http.post<ComprasMateriaPrimaArima[]>(this.url + "/api/Produccion/CompraMateriaPrima", CompraMp).pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }

  ExportarCompraArima(CompraMp){
    return this._http.post<any[]>(this.url + "/api/Produccion/CompraMateriaPrimaExportar", CompraMp).pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }

  DetalleControlCalidadMP(Item){
    const params =  new HttpParams().set('Item', Item)

    return this._http.get<SeguimientoCandidato[]>(this.url+"/api/Produccion/ControlCalidadItemMP", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  MostrarColumna(){
    return this._http.get<SeguimientoCandidato[]>(this.url+"/api/Produccion/MostrarColumnaMP").pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }


  LoteFabricacionEtiquetas(OrdenFabricacion){
    const params =  new HttpParams().set('NumeroLote', OrdenFabricacion);

    return this._http.get<any[]>(this.url+"/api/Produccion/LoteFabricacionEtiquetas", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  RegistrarLoteFabricacionEtiquetas(body){
    return this._http.post<any[]>(this.url+"/api/Produccion/RegistrarLoteFabricacionEtiquetas",body).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  ListarLoteEstado(){
    return this._http.get<any[]>(this.url+"/api/Produccion/ListarLoteEstado").pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }


  ModificarLoteEstado(body){
    return this._http.post<any[]>(this.url+"/api/Produccion/ModificarLoteEstado",body).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  //SEGUIMIENTO DE LA ORDEN DE COMPRA
  ListarItemOrdenCompra(Origen){
    const params =  new HttpParams().set('Origen', Origen);
    return this._http.get<any[]>(this.url+"/api/Produccion/ListarItemOrdenCompra", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  BuscarItemOrdenCompra(Item){
    const params =  new HttpParams().set('Item', Item);
    return this._http.get<any[]>(this.url+"/api/Produccion/BuscarItemOrdenCompra", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }
  

}
