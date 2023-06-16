import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioData } from '@data/interface/Request/Usuario.interface';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient, private _toastr: ToastrService) { }

  obtenerUsuarioDetalle(body){
    return this._http.post<UsuarioData>(this.url+"/api/usuario/ObtenerUsuario", body).pipe(
      catchError( () => throwError("Error al obtener datos del usuario") )
    );
  }

  ListarUsuarios(body){
    return this._http.post(this.url+"/api/usuario/ListarUsuarios", body).pipe(
      catchError (() => throwError("Error al obtener la lista de usuarios"))
    );
  }

  cambiarClave(body){
    return this._http.post(this.url + "/api/Usuario/CambioClave", body).pipe(
      catchError(() => throwError("Error al cambiar la contraseña del usuario"))
    )
  }

  ListarPersonalLaboral(){
    return this._http.get(this.url + "/api/usuario/ListarAsignacionPersonal").pipe(
      catchError(() => throwError("Error al Listar Persona laboral"))
    )
  }

  ListarPersonalArea(){
    return this._http.get(this.url + "/api/usuario/ListarAreaPersonaLaboral").pipe(
      catchError(() => throwError("Error al Listar Persona laboral"))
    )
  }

  RegistrarPersonaMasiva(body){
    return this._http.post(this.url + "/api/usuario/RegistrarPersonaMasiva", body).pipe(
      catchError(() => throwError("Error al Registra Persona Masiva"))
    )
  }

  FiltrarAreaPersona(idArea,NombrePersona){
    const params =  new HttpParams().set('idArea', idArea).set('NombrePersona',NombrePersona);
    return this._http.get(this.url + "/api/usuario/FiltrarAreaPersona",{'params': params}).pipe(
      catchError(() => throwError("Error al Registra Persona Masiva"))
    )
  }

  LiberalPersona(IdAsignacion){
    const params =  new HttpParams().set('IdAsignacion', IdAsignacion);
    return this._http.get(this.url + "/api/usuario/LiberalPersona",{'params': params}).pipe(
      catchError(() => throwError("Error al Liberar Personal"))
    )
  }

  ExportarExcelPersonaAsignacion(FechaInicio,FechaFinal){
    const params =  new HttpParams().set('FechaInicio', FechaInicio).set('FechaFinal',FechaFinal);
    return this._http.get(this.url + "/api/usuario/ExportarExcelPersonaAsignacion",{'params': params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al mostrar el calendario de orden compra ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al mostrar el calendario de orden compra ")
      })
    )
  }

  RegistrarEditarArea(IdArea,Descripcion){
    const params= new HttpParams().set('IdArea',IdArea).set('Descripcion',Descripcion);
    return this._http.get(this.url+"/api/usuario/RegistrarEditarArea", {"params":params}).pipe(
      catchError(() => throwError("Error al Registrar Area "))
    )
  }

  EliminarArea(IdArea){
    const params= new HttpParams().set('IdArea',IdArea);
    return this._http.get(this.url+"/api/usuario/EliminarAreaProduccion", {"params":params}).pipe(
      catchError(() => throwError("Error al Eliminar Area "))
    )
  }
  
  ListarPersonaTecnica(){
    return this._http.get(this.url+"/api/usuario/ListarPersonaTecnico").pipe(
      catchError(() => throwError("Error al Listar Persona  Tecnica "))
    )
  }

  ListarPersonaPorArea(IdArea){
    const params= new HttpParams().set('IdArea',IdArea);
    return this._http.get(this.url+"/api/usuario/ListarPersonaPorArea", {"params":params}).pipe(
      catchError(() => throwError("Error al Listar Persona  relacionada al area "))
    )
  }
}
