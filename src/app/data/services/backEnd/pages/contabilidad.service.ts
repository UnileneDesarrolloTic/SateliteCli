import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient,private _toastr: ToastrService) { }

  

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


  SubirExcelProcesoDetraccion(body){

      return this._http.post(`${environment.urlApiSatelliteCore}/api/Contabilidad/ProcesarDetraccionContabilidad`,body).pipe(
          catchError(() => throwError("Error al registrar el reporte"))
      )
  }

  ConsultarProductoCostoBase(body){
    return this._http.post(this.url+"/api/Contabilidad/ConsultarProductoCostoBase",body).pipe(
        catchError(() => throwError("Error al Consultar Costo Base Productos"))
    )
  }

  ProcesarProductoExcel(body){
    return this._http.post(this.url+"/api/Contabilidad/ProcesarProductoExcel",body).pipe(
        catchError(() => throwError("Error al Consultar Costo Base Productos Masivo"))
    )
  }

  ConsultarRecetaItemComponente(Item,FechaDocumento){
    const params =  new HttpParams().set('Item', Item);
    return this._http.get(this.url+"/api/Contabilidad/ConsultarRecetaProducto",{"params":params}).pipe(
        catchError(() => throwError("Error al Consultar Receta De Componente Item"))
    )
  }

  ListarItemComponentePrecio(body){
    return this._http.post<any>(this.url+"/api/Contabilidad/ListarItemComponentePrecio", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de listar de control lote "))
    );
  }

  ExportarProductoCostoBase(body){
    return this._http.post(this.url+"/api/Contabilidad/ExportarExcelProductoCostoBase",body).pipe(
        catchError(() => throwError("Error al Consultar Costo Base Productos"))
    )
  }

  ListarInformacionTransaccionKardex(body){
    return this._http.post(this.url+"/api/Contabilidad/InformacionTransaccionKardex",body).pipe(
      catchError((ex) => {
        this._toastr.error("Error al listar la información", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al listar la información")
      })
    );
  }

  RegistrarInformacionTransaccionKardex(body){
  return this._http.post(this.url+"/api/Contabilidad/RegistrarInformacionTransaccionKardex",body).pipe(
        catchError((ex) => {
          this._toastr.error("Error al Registrar la información", "Error !!", { timeOut: 4000, closeButton: true })
          return throwError("Error al Registrar la información")
        })
      );
  }

  ListarReporteCierre(Periodo){

    const params =  new HttpParams().set('Periodo', Periodo);
    return this._http.get(this.url+"/api/Contabilidad/ListarInformacionReporteCierre",{"params":params}).pipe(
          catchError((ex) => {
            this._toastr.error("Error al Listar el reporte de cierre", "Error !!", { timeOut: 4000, closeButton: true })
            return throwError("Error al Listar el reporte de cierre")
          })
        );
    }
  
  ListarDetalleReporteCierre(Id,Periodo,Tipo){
    const params =  new HttpParams().set('Id', Id).set('Periodo',Periodo).set('Tipo',Tipo);
    return this._http.get(this.url+"/api/Contabilidad/ListarDetalleReporteCierre",{"params":params}).pipe(
          catchError((ex) => {
            this._toastr.error("Error al Listar el Detalle reporte de cierre", "Error !!", { timeOut: 4000, closeButton: true })
            return throwError("Error al Listar el Detalle reporte de cierre")
          })
        );
    }

  AnularReporteCierre(Id){
    const params =  new HttpParams().set('Id', Id);
    return this._http.get(this.url+"/api/Contabilidad/AnularReporteCierre",{"params":params}).pipe(
          catchError((ex) => {
            this._toastr.error("Error al Listar el Detalle reporte de cierre", "Error !!", { timeOut: 4000, closeButton: true })
            return throwError("Error al Listar el Detalle reporte de cierre")
          })
        );
    }

}
