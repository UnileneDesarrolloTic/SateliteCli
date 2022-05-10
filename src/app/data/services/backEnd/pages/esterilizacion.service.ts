import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

}
