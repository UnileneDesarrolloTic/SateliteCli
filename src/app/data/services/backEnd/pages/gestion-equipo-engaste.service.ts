import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GestionEquipoEngasteService {

  private url = environment.urlApiSatelliteCore;
  
  constructor(private _http: HttpClient,private _toastr: ToastrService) { }
  
  empleado(){
    return this._http.get(this.url+"/api/GestionEquipoEngaste/ObtenerEmpleado").pipe(
      catchError (() => {
        this._toastr.error("Error obtener los empleado", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error obtener los empleado")
      })
    );
  }

  listadoDado(){
    return this._http.get(this.url+"/api/GestionEquipoEngaste/ObtenerListadoDados").pipe(
      catchError (() => {
        this._toastr.error("Error obtener listado Dados", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error obtener listado Dados")
      })
    );
  }

  registrarDadto(body){
    return this._http.post(this.url+"/api/GestionEquipoEngaste/RegistrarEquipoEngastado",body).pipe(
      catchError (() => {
        this._toastr.error("Error obtener registrar equipo", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error obtener registrar equipo")
      })
    );
  }

  litarEquipoEngaste(body){
    return this._http.post(this.url+"/api/GestionEquipoEngaste/ListarEquipoEngaste", body).pipe(
      catchError (() => {
        this._toastr.error("Error obtener listar equipo engaste", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error obtener listar equipo engaste")
      })
    );
  }

  informacionEngaste(idEQuipo){
    const params =  new HttpParams().set('idEquipo', idEQuipo)

    return this._http.get(this.url+"/api/GestionEquipoEngaste/ObtenerInformacionEquipo", {'params':params}).pipe(
      catchError (() => {
        this._toastr.error("Error obtener listar equipo engaste", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error obtener listar equipo engaste")
      })
    );
  }
}
