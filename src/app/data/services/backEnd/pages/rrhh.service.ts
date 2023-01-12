import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

  @Injectable({
    providedIn: 'root'
  })

  export class RRHHService {

    private url = environment.urlApiSatelliteCore + "/api/RRHH/";

    constructor(private _http: HttpClient, private _toastr: ToastrService) { }

    GenerarReporte(body)
    {
      return this._http.post(this.url + "GenerarReporteAsistencia", body).pipe(
        catchError(() => throwError("Error al generar el reporte"))
      )
    }

    ObtenerListaAsistencia(fecha: Date)
    {
      const params =  new HttpParams().set('Fecha', fecha.toDateString());

      return this._http.get(this.url + "ListarAsistencia",{'params': params}).pipe(
        map (result => result['content']),
        catchError((ex) => {
          this._toastr.error("Error al obtener la lista de asistencia", "Error !!", {timeOut: 4000, closeButton: true, tapToDismiss: true})
          return throwError(ex)
        })
      )
    }

    RegistrarHoraExtras(body){
      return this._http.post(this.url+"RegistrarHorasExtras",body).pipe(
        catchError((ex) => {
          this._toastr.error("Error al guardar el formulario de hora extras", "Error !!", { timeOut: 4000, closeButton: true })
          return throwError("Error al guardar los datos del formulario de horas extras")
        })
      );
    }

    ListarHoraExtras(body){
      return this._http.post(this.url+"ListarHoraExtrasPersona",body).pipe(
        catchError((ex) => {
          this._toastr.error("Error al momento de listar ", "Error !!", { timeOut: 4000, closeButton: true })
          return throwError("Error al momento de listar")
        })
      );
    }

    InformacionHorasExtrasCabecera(Cabecera){
      const params =  new HttpParams().set('Cabecera', Cabecera);

      return this._http.get(this.url+"InformacionHoraExtras",{'params': params}).pipe(
        catchError (() => throwError("Error al obtener Informacion de extras"))
      );
    }

  }