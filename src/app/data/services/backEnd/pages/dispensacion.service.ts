import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class DispensacionService {
  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient,private _toastr: ToastrService) { 
  }

  obtenerOrdenFabricacion(body){
    return this._http.post<any[]>(this.url+"/api/Dispensacion/ObtenerOrdenFabricacion", body).pipe(
      catchError (() => {
        this._toastr.error("Error al buscar la orden de fabricacion", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al buscar la orden de fabricacion")
      })
    );
  }

  obtenerRecetasOrdenFabricacion(ordenFabricacion:string ){
    const params = new HttpParams().set('ordenFabricacion',ordenFabricacion);

    return this._http.get<any[]>(this.url+"/api/Dispensacion/RecetasOrdenFabricacion", {params: params}).pipe(
      catchError (() => {
        this._toastr.error("Error al buscar la receta orden fabricacion", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al buscar la receta orden fabricacion")
      })
    );
  }


  registrarDispensacion(body ){
    return this._http.post<any[]>(this.url+"/api/Dispensacion/RegistrarDispensacionMP", body).pipe(
      catchError (() => {
        this._toastr.error("Error al registrar Despensación", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al registrar Despensación")
      })
    );
  }

  historialDispensacion(ordenFabricacion:string, lote:string ){

    const params = new HttpParams().set('ordenFabricacion',ordenFabricacion).set('lote',lote);

    return this._http.get(this.url+"/api/Dispensacion/HistorialDispensacionMP", {params: params}).pipe(
      catchError (() => {
        this._toastr.error("Error al historial de dispensacion", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al historial de dispensacion")
      })
    );
  }

  informacionItem(item:string, ordenFabricacion:string, secuencia:string){
    const params =  new HttpParams().set('item', item.toString()).set('ordenFabricacion',ordenFabricacion).set('secuencia',secuencia);

    return this._http.get<any>(this.url+"/api/Dispensacion/InformacionItem", {params: params}).pipe(
      catchError ((ex)=> throwError('Error al momento de traer información producto terminado'))
    );
  }

  dispensacionRecetaGlobal(){
    return this._http.get<any>(this.url+"/api/Dispensacion/DetalleDispensacionReceta").pipe(
      catchError (() => {
        this._toastr.error("Error al detalle dispensacion global", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al detalle dispensacion global")
      })
    );
  }
  
  dispensacionRegistrarDispensacionGeneral(body){
    return this._http.post(this.url+"/api/Dispensacion/RegistrarRecetasGlobal", body).pipe(
      catchError (() => {
        this._toastr.error("Error al registrar dispensacion Global", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al registrar dispensacion Global")
      })
    );
  }
  
  dispensacionGuiaDespacho(body){
    return this._http.post<any>(this.url+"/api/Dispensacion/DispensacionGuiaDespacho", body).pipe(
      catchError (() => {
        this._toastr.error("Error al dispensacion guia Despacho ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al dispensacion guia Despacho")
      })
    );

  }

  mostrarDispensacionGuiaDespacho(id)
  {
    const params =  new HttpParams().set('id', id);
    return this._http.get(this.url+"/api/Dispensacion/MostrarDispensacionDespacho", {'params': params}).pipe(
      catchError (() => {
        this._toastr.error("Error al dispensacion mostrar despacho", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al dispensacion mostrar despacho")
      })
    );
  }

  generacionCodigoBarra(id){
    const params =  new HttpParams().set('id', id);
    return this._http.get(this.url+"/api/Dispensacion/GeneracionPdfDespacho", {'params': params}).pipe(
      catchError (() => {
        this._toastr.error("Error al dispensacion mostrar generación codigo barra despacho", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al dispensacion mostrar generación codigo barra despacho")
      })
    );
  }
  
  
}
