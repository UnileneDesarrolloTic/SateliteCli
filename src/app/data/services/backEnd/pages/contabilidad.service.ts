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
  

}
