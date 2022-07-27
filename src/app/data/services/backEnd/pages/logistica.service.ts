import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class LogisticaService {
  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { 
  }

  ObtenerNumeroGuia(NumeroGuia){
    const params = new HttpParams().set('NumeroGuia',NumeroGuia);
   
    return this._http.get<any[]>(this.url+"/api/Logistica/ObtenerNumeroGuias", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Numeros de guia"))
    );
  }
}
