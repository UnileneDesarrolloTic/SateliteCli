import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";


@Injectable({
  providedIn:"root"
})

export class AnalisisAgujaService
{

  private url = environment.urlApiSatelliteCore + "/api/AnalisisAguja/";

  constructor(private _http: HttpClient) { }

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

  ObtenerAnalisisAguja(loteAnalisis: string){

    const params =  new HttpParams().set('loteAnalisis', loteAnalisis)

    return this._http.get(this.url + "ObtenerAnalisisAguja", {'params': params}).pipe(
      catchError(() => throwError("Error al obtener el análisis de la aguja"))
    )
  }

}
