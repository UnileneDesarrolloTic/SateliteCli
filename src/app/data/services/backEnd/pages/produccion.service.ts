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
  ListarItemOrdenCompra(Anio){
    const params =  new HttpParams().set('Anio',Anio);
    return this._http.get<any[]>(this.url+"/api/Produccion/ListarItemOrdenCompra", {'params': params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al mostrar el calendario de orden compra ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al mostrar el calendario de orden compra ")
      })
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

  exportarCompraDrogueria(idproveedor, mostrar, agrupador){

    const params = new HttpParams().set('idproveedor',idproveedor).set('mostrarcolumna',mostrar).set('agrupador',agrupador);
    return this._http.get(this.url+"/api/Produccion/ExcelCompraDrogueria", {"params":params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al Exportar la información de drogueria ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al Exportar la información de drogueria ")
      })
    );
  }

  generarOrdenCompraPrevios(){
    return this._http.get(this.url +"/api/Produccion/MostrarOrdenCompraPrevios").pipe(
      catchError( _ => {
        this._toastr.error("Error al listar la orden de compra simulada ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al listar la orden de compra simulada ")
      })
    )
  }


  visualizarOrdenCompraPrevios(proveedor){
    const params =  new HttpParams().set('proveedor',proveedor)
    return this._http.get(this.url +"/api/Produccion/VisualizarOrdenCompraSimulada", {"params": params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al visualizar la orden de compra", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al visualizar la orden de compra")
      })
    )
  }
 


  ordenCompraVencidas(){
    return this._http.get(this.url+"/api/Produccion/MostrarOrdenCompraVencidas").pipe(
      catchError( _ => {
        this._toastr.error("Error al mostrar las ordenes de compra ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al mostrar las ordenes de compra ")
      })
    );
  }
  
  guardarOrdenCompraVencida(body){
    return this._http.post(this.url+"/api/Produccion/GuardarOrdenCompraVencida",body).pipe(
      catchError( _ => {
        this._toastr.error("Error al momento de modificar el estado orden compra ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al momento de modificar el estado orden compra ")
      })
    );
  }

  listarSeguimientoCompraAguja(){
    return this._http.get(this.url+"/api/Produccion/InformacionSeguimientoAguja").pipe(
      catchError( _ => {
        this._toastr.error("Error al mostrar el listado de las agujas ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al mostrar el listado de las agujas ")
      }));
  }
  generarOrdenCompraDrogueria(){
    return this._http.get(this.url+"/api/Produccion/GenerarOrdenCompraDrogueria").pipe(
      catchError( _ => {
        this._toastr.error("Error al Generar Orden Compra", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al Generar Orden Compra")
      })
    );
  }

  exportarSeguimientoCompraAguja(mostrarColumna){
    const params = new HttpParams().set('mostrarColumna',mostrarColumna); 
    return this._http.get(this.url+"/api/Produccion/InformacionSeguimientoAgujaExcel",  {"params":params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al momento de exportar las agujas ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al momento de exportar las agujas ")
      })
    );
  }

  
  mostrarOrdenCompraArima(Item,Tipo){
    const params = new HttpParams().set('Item',Item).set('Tipo',Tipo); 
    return this._http.get(this.url+"/api/Produccion/MostrarOrdenCompraArima",  {"params":params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al momento de exportar las agujas ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al momento de exportar las agujas ")}));
     
  }
  
  registrarOrdenCompraDrogueria(body){
    return this._http.post(this.url+"/api/Produccion/RegistrarOrdenCompraDrogueria",body).pipe(
      catchError( _ => {
        this._toastr.error("Error al momento de registrar el estado orden compra ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al momento de registrar el estado orden compra ")
      }));
  }


  seguimientoCompraNacionalImportacion(){
    //const params = new HttpParams().set('mostrarColumna',mostrarColumna); 
    return this._http.get(this.url+"/api/Produccion/InformacionSeguimientoCompraImportacion").pipe(
      catchError( _ => {
        this._toastr.error("Error al momento de mostrar informacion de compra importada o nacional ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al momento de mostrar informacion de compra importada o nacional ")
      })
    );
  }

  exportarseguimientoCompraNacionalImportacion(mostrarColumna){
    const params = new HttpParams().set('mostrarColumna',mostrarColumna); 
    return this._http.get(this.url+"/api/Produccion/ReporteSeguimientoCompraImportacionExcel",  {"params":params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al momento de exportar excel de compra nacional importada", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al momento de exportar excel de compra nacional importada")
      })
    );
  }


  mostrarOrdenCompraNacionalImportacion(item, tipo, material){
    const params = new HttpParams().set('item',item).set('tipo',tipo).set('material', material); 
    return this._http.get(this.url+"/api/Produccion/MostrarOrdenCompraNacionalImportacion",  {"params":params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al momento de mostrar la orden de comprar" + item, "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al momento de mostrar la orden de compra")
      })
    );
  }

}
