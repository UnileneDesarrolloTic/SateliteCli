import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
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
      return this._http.post(this.url+"RegistrarHorasExtras", body).pipe(
        catchError(_ => {
          this._toastr.error("Error al guardar el formulario de hora extras", "Error !!", { timeOut: 4000, closeButton: true })
          return throwError("Error al guardar los datos del formulario de horas extras")
        })
      );
    }

    ListarHoraExtras(body){
      return this._http.post(this.url+"ListarHoraExtrasPersona",body).pipe(
        catchError(_ => {
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

    ProcesarHorasExtrasPlanilla(periodo: string)
    {
      const params =  new HttpParams().set('periodo', periodo);
      return this._http.get(this.url+"ProcesarHorasExtrasPlanilla",{'params': params}).pipe(
        catchError(_ => {
          this._toastr.error("Error al procesar las horas extras", "Error !!", {tapToDismiss: true, closeButton: true, timeOut: 3000});
          return throwError("Error al procesar las horas extras");
        })
      );
    }

    ReporteHorasExtrasGeneradas_Excel(periodo: string): Observable<string>
    {
      const params =  new HttpParams().set('periodo', periodo);
      return this._http.get<string>(this.url+"ReporteHorasExtrasGenerada",{'params': params}).pipe(
        catchError(_ => {
          this._toastr.error("Error al generar reporte de horas extras generadas", "Error !!", {tapToDismiss: true, closeButton: true, timeOut: 3000});
          return throwError("Error al generar reporte de horas extras generadas");
        })
      );
    }

    ReporteAutorizacionSobreTiempoPorPersona_PDF(periodo: string): Observable<string>
    {
      const params =  new HttpParams().set('periodo', periodo);
      return this._http.get<string>(this.url+"RptAutorizacionSobretiempoPorPersona",{'params': params}).pipe(
        catchError(_ => {
          this._toastr.error("Error al generar repote de autorizacion de sobretiempo", "Error !!", {tapToDismiss: true, closeButton: true, timeOut: 3000});
          return throwError("Error al generar repote de autorizacion de sobretiempo");
        })
      );
    }


    ExportarFormatoAutorizacionSobreTiempo(id: number): Observable<string>
    {
      const params =  new HttpParams().set('id', id.toString());
      return this._http.get<string>(this.url+"FormatoAutorizacionSobretiempo", {'params': params}).pipe(
        catchError(_ => {
          this._toastr.error("Error al generar el formato de sobretiempo", "Error !!", {tapToDismiss: true, closeButton: true, timeOut: 3000});
          return throwError("Error al generar el formato de sobretiempo");
        })
      );
    }

    reporteComisionVendero( periodo:string): Observable<string>
    {
      const params =  new HttpParams().set('periodo', periodo);
      return this._http.get<string>(this.url+"ReporteComisionVendedor", {'params': params}).pipe(
        catchError(_ => {
          this._toastr.error("Error al mostrar el reporte de comision de vendedor", "Error !!", {tapToDismiss: true, closeButton: true, timeOut: 3000});
          return throwError("Error al mostrar el reporte de comision de vendedor");
        })
      );
    }


    exportarComisionVendero( periodo:string): Observable<string>
    {
      const params =  new HttpParams().set('periodo', periodo);
      return this._http.get<string>(this.url+"ReporteComisionVendedorExcel", {'params': params}).pipe(
        catchError(_ => {
          this._toastr.error("Error al mostrar el exportar la comision de vendedor", "Error !!", {tapToDismiss: true, closeButton: true, timeOut: 3000});
          return throwError("Error al mostrar el exportar la comision de vendedor");
        })
      );
    }

  }