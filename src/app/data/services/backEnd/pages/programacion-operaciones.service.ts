import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
  })
  export class ProgramacionOperacionesService {
    private url = environment.urlApiSatelliteCore;
  
    constructor(private _http: HttpClient,private _toastr: ToastrService) { 
    }

    listarAgrupador(gerencia){
      const params = new HttpParams().set('gerencia', gerencia);

      return this._http.get(this.url+"/api/ProgramacionOperaciones/ObtenerAgrupadores", {"params": params}).pipe(
        catchError (() => {
          this._toastr.error("Error obtener los agrupadores", "Error !!", { timeOut: 4000, closeButton: true })
          return throwError("Error obtener los agrupadores")
        })
      );
    }
  
    obtenerProgramacionOrdenFabricacion(body){
        return this._http.post<any[]>(this.url+"/api/ProgramacionOperaciones/ObtenerProgramacionOrdenFabricacion", body).pipe(
          catchError (() => {
            this._toastr.error("Error al buscar la orden de fabricacion o lote ", "Error !!", { timeOut: 4000, closeButton: true })
            return throwError("Error al buscar la orden de fabricacion o lote")
          })
        );
    }

    ActualizarFechaProgramada(body){
      return this._http.post(this.url+"/api/ProgramacionOperaciones/ActualizarFechaProgramada", body).pipe(
        catchError (() => {
          this._toastr.error("Error al registar la fecha entrega o inicio", "Error !!", { timeOut: 4000, closeButton: true })
          return throwError("Error al registar la fecha entrega o inicio")
        })
      );
    }


    obteneListadoFechasProgramadas(ordenFabricacion:string, tipoFecha:string){
      const params = new HttpParams().set('ordenFabricacion', ordenFabricacion).set('tipoFecha',tipoFecha);

      return this._http.get(this.url+"/api/ProgramacionOperaciones/ObtenerTipoFechaOrdenFabricacion", {"params": params}).pipe(
        catchError (() => {
          this._toastr.error("Error al buscar el registro de las fechas ", "Error !!", { timeOut: 4000, closeButton: true })
          return throwError("Error al buscar el registro de las fechas")
        })
      );
  }
    
}
  