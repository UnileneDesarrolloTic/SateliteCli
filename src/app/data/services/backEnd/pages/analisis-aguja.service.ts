import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DatosAnalisisAgujaFlexion } from "@data/interface/Response/DatosAnalisisAgujaFlexion.interface";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";


@Injectable({
  providedIn:"root"
})

export class AnalisisAgujaService
{

  private url = environment.urlApiSatelliteCore + "/api/AnalisisAguja/";

  constructor(private _http: HttpClient, private _toastr: ToastrService) { }

  ListarOrdenesCompra(numero: string){
    const params =  new HttpParams().set('numeroOrden', numero)

    return this._http.get(this.url+"ListaOrdenesCompra", {'params': params}).pipe(
      catchError (() => throwError("Error con el LISTADO DE ORDENES DE COMPRA"))
    );
  }

  ListarAnalisis(ordenCompra: string, lote: string, item: string, pagina: number){

    const params =  new HttpParams().set('ordenCompra', ordenCompra).set("lote", lote).set("item", item).set("pagina", pagina.toString());

    return this._http.get(this.url+"ListarAnalisisAguja", {'params': params}).pipe(
      catchError (() => throwError("Error con el LISTADO DE ANALISIS DE AGUJAS"))
    );

  }

  ListarCiclos(identificador: string){
    const params =  new HttpParams().set('identificador', identificador)
    return this._http.get(this.url+"ListarCiclos", {'params': params}).pipe(
      catchError (() => throwError("Error con el LISTADO DE ANALISIS DE AGUJAS"))
    );
  }

  CantidadPruebasFlexionPorItem(controlNumero: string, secuencia: number){

    const params =  new HttpParams().set('controlNumero', controlNumero).set('secuencia', secuencia.toString())

    return this._http.get(this.url + "CantidadPruebasFlexionPorItem",{'params': params}).pipe(
      catchError(() => throwError("Error al obtener la cantidad de pruebas"))
    )
  }

  RegistrarAnalisisAguja(body: object){
    return this._http.post(this.url + "RegistrarAnalisisAguja", body).pipe(
      catchError(() => throwError("Error al obtener la cantidad de pruebas"))
    )
  }

  ValidarLoteCreado(controlNumero: string, secuencia: number){

    const params =  new HttpParams().set('controlNumero', controlNumero).set('secuencia', secuencia.toString())

    return this._http.get(this.url + "ValidarLoteCreado", {'params': params}).pipe(
      catchError(() => throwError("Error al validad el lote creado"))
    )
  }

  DatosAnalisisAgujaFlexion(loteAnalisis: string)
  {
    const params =  new HttpParams().set('loteAnalisis', loteAnalisis)

    return this._http.get<DatosAnalisisAgujaFlexion>(this.url + "AnalisisAgujaFlexion", {'params': params})
    .pipe(
      catchError(() => {
        this._toastr.error("Error al obtener los datos de la prueba de flexión", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al obtener el análisis de la aguja")})
    )
  }

  GuardarEditarPruebaFlexionAguja(body:{}[]){
    return this._http.post(this.url + "GuardarEditarPruebaFlexionAguja", body).pipe(
      catchError(() => {
        this._toastr.error("Error al guardar los datos de la prueba de flexión", "Error en el servidor!!", {timeOut: 4000, closeButton: true, tapToDismiss: true});
        return throwError("Error al guardar los datos de la prueba de flexión")
      })
    )
  }

  ObtenerReporteFlexionAguja(loteAnalisis: string){
    const params =  new HttpParams().set('loteAnalisis', loteAnalisis)

    return this._http.get(this.url + "ReporteAnalisisFlexion", {'params': params})
    .pipe(
      catchError(() => {
        this._toastr.error("Error al descargar el reporte de flexión", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al descargar el reporte de flexión")
      })
    )
  }

  ObtenerReporteAnalisisAguja(loteAnalisis: string){
    const params =  new HttpParams().set('loteAnalisis', loteAnalisis)

    return this._http.get(this.url + "ReporteAnalisisAguja", {'params': params})
    .pipe(
      catchError(() => {
        this._toastr.error("Error al obtener el reporte de análisis de la aguja", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al obtener el reporte de análisis de la aguja")
      })
    )
  }

  ObtenerDatosGenerales(loteAnalisis: string){
    const param = new HttpParams().set('loteAnalisis', loteAnalisis)
    return this._http.get(this.url + "ObtenerDatosGenerales", {'params': param}).pipe(
      map (result => result['content']),
      catchError(() => {
        this._toastr.error("Error al obtener datos generales del análisis", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError('Error al obtener los datos generales del análisis')
      })
    )
  }

  ObtenerPlanMuestreo(loteAnalisis: string){
    const param = new HttpParams().set('loteAnalisis', loteAnalisis)

    return this._http.get(this.url + "ObtenerPlanMuestreo", {'params': param}).pipe(
      catchError(() => {
        this._toastr.error("Error al obtener datos de plan muestreo y flexión", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError('Error al obtener los datos generales del análisis')
      })
    )
  }

  GuardarPlanMuestreo(body){
    return this._http.post(this.url + "GuardarPlanMuestreo", body).pipe(
      catchError(() => {
        this._toastr.error("Error al guardar los datos del formulario", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al guardar los datos Plan Muestreo")
      })
    )
  }

  ObtenerPruebaDimensional(loteAnalisis: string){
    const param = new HttpParams().set('loteAnalisis', loteAnalisis)

    return this._http.get(this.url + "ObtenerPruebaDimensional", {'params': param}).pipe(
      catchError(() => {
        this._toastr.error("Error al obtener los datos de la prueba dimensional", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al obtener los datos de prueba dimensional")
      })
    )
  }

  GuardarPruebaDimensional(body){
    return this._http.post(this.url + "GuardarPruebaDimensional", body).pipe(
      catchError(() => {
        this._toastr.error("Error al guardar los datos del formulario", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al guardar los datos prueba dimensional")
      })
    )
  }

  ObtenerPruebaElasticidadPerforacion(loteAnalisis: string){
    const param = new HttpParams().set('loteAnalisis', loteAnalisis)

    return this._http.get(this.url + "ObtenerPruebaElasticidadPerforacion", {'params': param}).pipe(
      catchError(() => {
        this._toastr.error("Error al obtener los datos de la prueba de elasticidad y perforeación", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al guardar los datos ")
      })
    )
  }

  GuardarPruebaElasticidadPerforacion(body){
    return this._http.post(this.url + "GuardarPruebaElasticidadPerforacion", body).pipe(
      catchError(() => {
        this._toastr.error("Error al guardar los datos del formulario", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al guardar los datos prueba elasticidad perforacion")
      })
    )
  }

  ObtenerPruebaAspecto(loteAnalisis: string){
    const param = new HttpParams().set('loteAnalisis', loteAnalisis)

    return this._http.get(this.url + "ObtenerPruebaAspecto", {'params': param}).pipe(
      catchError(() => {
        this._toastr.error("Error al obtener los datos de la prueba de aspecto", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al guardar los datos ")
      })
    )
  }

  GuardarPruebaAspecto(body){
    return this._http.post(this.url + "GuardarPruebaAspecto", body).pipe(
      catchError(() => {
        this._toastr.error("Error al guardar los datos del formulario", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al guardar los datos prueba de aspecto")
      })
    )
  }


}
