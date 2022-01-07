import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioData } from '@data/interface/Request/Usuario.interface';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { }

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
}
