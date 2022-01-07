import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
  })
  export class RRHHService {
    private url = environment.urlApiSatelliteCore + "/api/RRHH/";;
    constructor(private _http: HttpClient) { }
    GenerarReporte(body){
        return this._http.post(this.url + "GenerarReporteAsistencia", body).pipe(
          catchError(() => throwError("Error al generar el reporte"))
        )
      }
  }