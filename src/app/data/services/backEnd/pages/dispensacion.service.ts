import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class DispensacionService {
  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient,private _toastr: ToastrService) { 
  }

  obtenerOrdenFabricacion(body){
    return this._http.post<any[]>(this.url+"/api/Dispensacion/ObtenerOrdenFabricacion", body).pipe(
      catchError (() => {
        this._toastr.error("Error al buscar la orden de fabricacion", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al buscar la orden de fabricacion")
      })
    );
  }

  obtenerRecetasOrdenFabricacion(ordenFabricacion:string ){
    const params = new HttpParams().set('ordenFabricacion',ordenFabricacion);

    return this._http.get<any[]>(this.url+"/api/Dispensacion/RecetasOrdenFabricacion", {params: params}).pipe(
      catchError (() => {
        this._toastr.error("Error al buscar la receta orden fabricacion", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al buscar la receta orden fabricacion")
      })
    );
  }


  RegistrarDispensacion(body ){
    return this._http.post<any[]>(this.url+"/api/Dispensacion/RegistrarDispensacionMP", body).pipe(
      catchError (() => {
        this._toastr.error("Error al registrar Despensación", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al registrar Despensación")
      })
    );
  }

  
  
}
