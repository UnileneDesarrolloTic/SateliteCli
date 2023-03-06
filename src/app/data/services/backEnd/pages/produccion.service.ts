import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ComprasMateriaPrimaArima } from '@data/interface/Response/CompraMateriaPrimaArima';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient,private _toastr: ToastrService) { }

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
  ListarItemOrdenCompra(FiltroElemento){
    const params =  new HttpParams().set('Origen', FiltroElemento.Origen).set('Anio',FiltroElemento.Anio).set('Regla',FiltroElemento.regla);
    return this._http.get<any[]>(this.url+"/api/Produccion/ListarItemOrdenCompra", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  BuscarItemOrdenCompra(Item,Anio){
    const params =  new HttpParams().set('Item', Item).set('Anio',Anio);
    return this._http.get<any[]>(this.url+"/api/Produccion/BuscarItemOrdenCompra", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  ActualizarFechaPrometida(body){
    return this._http.post<any[]>(this.url+"/api/Produccion/ActualizarFechaPrometida", body).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  VisualizarOrdenCompra(OrdenCompra){
    const params =  new HttpParams().set('OrdenCompra', OrdenCompra);
    return this._http.get<any[]>(this.url+"/api/Produccion/VisualizarOrdenCompra", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  ActualizarOrdenCompraMasiva(body){
    return this._http.post<any[]>(this.url+"/api/Produccion/ActualizarFechaPrometidaMasiva", body).pipe(
      catchError (() => throwError("Error al obtener el Actualizar Fecha Comprometida masiva"))
    );
  }

  ExcelMateriaPrima(regla){
    const params =  new HttpParams().set('regla', regla);
    return this._http.get(this.url+"/api/Produccion/ExportarAgujasMateriaPrima", {"params":params}).pipe(
      catchError (() => throwError("Error al obtener el Exportacion Materia Prima"))
    );
  }
  

  reporteSeguimientoDrogueria(idproveedor){
    const params = new HttpParams().set('idproveedor',idproveedor);
    return this._http.get(this.url+"/api/Produccion/SeguimientoOCDrogueria",{"params":params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al mostrar el seguimiento de drogueria ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al mostrar el seguimiento de drogueria ")
      })
    );
  }

  mostarOrdenCompraItem(Item){
    const params =  new HttpParams().set('Item', Item);
    return this._http.get(this.url+"/api/Produccion/MostrarOrdenCompraDrogueria",{"params":params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al mostrar orden de compra ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al mostrar orden de compra ")
      })
    );
  }
  
  mostrarProveedores(){
    return this._http.get(this.url+"/api/Produccion/MostrarProveedorDrogueria").pipe(
      catchError( _ => {
        this._toastr.error("Error al momento de traer los proveedores ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al momento de traer los proveedores ")
      })
    );
  }

  exportarCompraDrogueria(idproveedor,mostrar){

    const params = new HttpParams().set('idproveedor',idproveedor).set('mostrarcolumna',mostrar);
    return this._http.get(this.url+"/api/Produccion/ExcelCompraDrogueria", {"params":params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al Exportar la información de drogueria ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al Exportar la información de drogueria ")
      })
    );
  }


  ordenCompraVencidas(){
    return this._http.get(this.url+"/api/Produccion/MostrarOrdenCompraVencidas").pipe(
      catchError( _ => {
        this._toastr.error("Error al mostrar las ordenes de compra ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al mostrar las ordenes de compra ")
      })
    );
  }
  
  GuardarOrdenCompraVencida(body){
    return this._http.post(this.url+"/api/Produccion/GuardarOrdenCompraVencida",body).pipe(
      catchError( _ => {
        this._toastr.error("Error al momento de modificar el estado orden compra ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al momento de modificar el estado orden compra ")
      })
    );
  }

}
