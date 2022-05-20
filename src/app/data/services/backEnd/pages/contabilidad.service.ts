import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { }

  

  ListarDetracciones(){
    return this._http.get(this.url+"/api/Contabilidad/ListarDetraccionContabilidad").pipe(
      catchError (() => throwError("Error al obtener la lista de usuarios"))
    );
  }

  GenerarBlogProcesoDetraccion(body){
    return this._http.post(this.url+"/api/Contabilidad/GernerarBlogNotasDetraccion", body).pipe(
      catchError (() => throwError("Error al obtener la lista de usuarios"))
    );
  }


  SubirExcelProcesoDetraccion(urlarchivo){
    const params = new HttpParams().set('urlarchivo', urlarchivo);

      return this._http.get(`${environment.urlApiSatelliteCore}/api/Contabilidad/ProcesarDetraccionContabilidad`,{'params':params}).pipe(
          catchError(() => throwError("Error al registrar el reporte"))
      )
  }

  

}
