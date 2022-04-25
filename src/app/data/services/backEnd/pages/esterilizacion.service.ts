import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CertificadoData } from '@data/interface/Request/Certificado.interface';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn:"root"
})

export class EsterilizacionService{
    private url = environment.urlApiSatelliteCore + "/api/ControlCalidad/";

    constructor(private _http: HttpClient) { }

  ListarCertificados(body){
    return this._http.post(this.url+"ListarCertificados", body).pipe(
      catchError (() => throwError("Error al obtener la lista de certificados"))
    );
  }

  RegistrarCertificado(body){
    return this._http.post(this.url + "RegistrarCertificado", body).pipe(
      catchError(() => throwError("Error al registrar el certificado"))
    )
  }

  ListarLotes(body){
    return this._http.post(this.url+"ListarLotes", body).pipe(
      catchError (() => throwError("Error al obtener la lista de lotes"))
    );
  }

  RegistrarLote(body){
    return this._http.post(this.url + "RegistrarLote", body).pipe(
      catchError(() => throwError("Error al registrar el lote"))
    )
  }

  GenerarReporte(body){
    return this._http.post(this.url + "GenerarReporte", body).pipe(
      catchError(() => throwError("Error al registrar el reporte"))
    )
  }

  ListarOrdenesCompra(numero: string){
    const params =  new HttpParams().set('NumeroOrden', numero)

    return this._http.get(this.url+"ListaOrdenesCompra", {'params': params}).pipe(
      catchError (() => throwError("Error con el LISTADO DE ORDENES DE COMPRA"))
    );
  }

  ListarAnalisis(lote: string){
    const params =  new HttpParams().set('lote', lote)
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
  
  RegistrarControlAgujas(body){
    return this._http.post(this.url + "RegistrarControlAgujas", body).pipe(
      catchError(() => throwError("Error al registrar el lote"))
    )
  }

}


