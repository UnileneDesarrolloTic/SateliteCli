import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
  })
  export class GestionCalidadService {
    private url = environment.urlApiSatelliteCore + "/api/GestionCalidad";
    
    constructor(private _http: HttpClient, private _toastr: ToastrService) { }

    listarMateriaPrima(tipoConsulta: string, lote: string)
    {
        const param = new HttpParams().set('tipoConsulta', tipoConsulta ).set('lote', lote)

      return this._http.get(this.url + "/ListarMateriaPrima", {'params': param}).pipe(
        map( (resp: any) => 
        {
            const listaMP: any[] = []

            resp.forEach(materiaPrima => {
                listaMP.push({...materiaPrima, flagSelect: false})
            });
              
            return listaMP
        }),
        catchError(() => {
          this._toastr.error("Error la obtener la lista de materia prima.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error la obtener la lista de materia prima.")
        })
      )
    }

    obtenerDetalleSeguimientoLote(body)
    {
        return this._http.post(this.url + "/DetalleSeguimientoPorLote", body).pipe(
            catchError(() => {
              this._toastr.error("Error al obtener el detalle de la información.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
              return throwError("Error al obtener el detalle de la información.")
            })
          ) 
    }


    obtenerVentaPorCliente(body)
    {
        return this._http.post(this.url + "/VentasPorCliente", body).pipe(
            catchError(() => {
              this._toastr.error("Error al obtener las ventas por cliente.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
              return throwError("Error al obtener las ventas por cliente.")
            })
          ) 
    }

    ReporteVentasPorCliente(body)
    {
      return this._http.post(this.url + "/RptVentasPorCliente", body).pipe(
          catchError(() => {
            this._toastr.error("Error al descargar el reporte.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
            return throwError("Error al descargar el reporte")
          })
      )
    }

    ListarSsoma(TipoDocumento,Codigo)
    {
      const params =  new HttpParams().set('TipoDocumento', TipoDocumento).set('Codigo',Codigo)
        return this._http.get(this.url + "/ListarSsoma",{"params":params}).pipe(
            catchError(() => {
              this._toastr.error("Error al obtener la lista de Ssoma.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
              return throwError("Error al obtener la lista de Ssoma.")
            })
          ) 
    }

    RegistrarSsoma(body)
    {
     
        return this._http.post(this.url + "/RegistrarSsoma",body).pipe(
            catchError(() => {
              this._toastr.error("Error al obtener al Registrar de Ssoma.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
              return throwError("Error al obtener al Registrar de Ssoma.")
            })
          ) 
    }

    EliminarSsoma(idSsoma)
    {
      const params =  new HttpParams().set('idSsoma', idSsoma)
        return this._http.get(this.url + "/EliminarSsoma",{"params":params}).pipe(
            catchError(() => {
              this._toastr.error("Error al obtener la Eliminar un Ssoma.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
              return throwError("Error al obtenerla Eliminar un Ssoma.")
            })
          ) 
    }
}