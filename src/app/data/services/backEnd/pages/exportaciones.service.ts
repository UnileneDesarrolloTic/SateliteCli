import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ExportacionesService {
  private url = environment.urlApiSatelliteCore + "/api/Exportaciones";
  constructor(private _http: HttpClient, private _toastr: ToastrService) { }

  ListarCotizacionExportaciones(body){
    return this._http.post(this.url+"/ListarCotizacionExportaciones", body).pipe(
      catchError (() => throwError("Error al obtener la lista cotización Exportaciones"))
    );
  }
  BusquedaCotizacionExportaciones(NumeroDocumento){
    const params =  new HttpParams().set('NumeroDocumento', NumeroDocumento)
    return this._http.get(this.url+"/BuscarCotizacionExportaciones", {"params":params}).pipe(
      catchError (() => throwError("Error al obtener la Busqueda cotización Exportaciones"))
    );
  }

  ProcesarExcelExportaciones(body){
    return this._http.post(this.url+"/ProcesarExcelExportaciones",body).pipe(
      catchError (() => throwError("Error al obtener Procesar Excel Exportaciones"))
    );
  }

  GuardarCotizacionExportaciones(body){
    return this._http.post(this.url+"/GuardarCotizacionExportaciones",body).pipe(
      catchError (() => throwError("Error al obtener Guardar cotización Exportaciones"))
    );
  }

  ObtenerListaItemMaster(Opcion,Descripcion){
    const params =  new HttpParams().set('Opcion', Opcion).set('Descripcion',Descripcion)
    return this._http.get(this.url+"/BuscarItemMast",{"params":params}).pipe(
      catchError (() => throwError("Error al obtener Busqueda Item Master"))
    );
  }

  DesactivarItemCotizacionExportacion(NumeroDocumento,Item,Linea){
    const params =  new HttpParams().set('NumeroDocumento', NumeroDocumento).set('Item',Item).set('Linea',Linea)
    return this._http.get(this.url+"/DesactivarItemCotizacionExportacion",{"params":params}).pipe(
      catchError (() => throwError("Error al obtener Eliminacion de Item Detalle de cotización"))
    );
  }
}
