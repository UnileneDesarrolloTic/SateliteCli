import { CryptoService } from '@shared/services/comunes/crypto.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthReturn } from '@data/interface/auth_Return.interface';
import { SesionService } from '@shared/services/comunes/sesion.service';
import { DataAccesoRuta } from '@data/interface/Request/AccesoRuta.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient, private router:Router, private sesionService: SesionService,
        private crypto: CryptoService, private toastr: ToastrService) { }

  autenticarUsuario(body){
    return this._http.post<AuthReturn>(this.url+"/api/Authentication/authenticateUser", body).pipe(
      catchError( () => {
        return throwError("Error al autenticar el usuario")
      } )
    );
  }

  isExpiredToken(){

    try{
      var  firma: string = this.sesionService.datosPersonales().token.split('.',2)[1];
      var {exp} = JSON.parse(this.crypto.descodificarBase64(firma))

      console.log('Vencimiento de token')
      console.log(new Date(exp * 1000) <= new Date())

      if (new Date(exp * 1000) <= new Date())
        return true
      else
        return false

    }catch (err){
      return true;
    }
  }

  isLogin(){

    try {

      const data=JSON.parse(this.crypto.desencriptar(localStorage.getItem('datos')));
      var token_access = data['access_token'];

    } catch (error) {
      this.onLogout();
      return false
    }

    if(!token_access) return false;

    return true;
  }

  validarAccesoRuta(body){
    return this._http.post<DataAccesoRuta>(this.url+"/api/ValidacionAccesos/ValidarAccesoRuta", body).pipe(
      catchError( () => throwError("Error al verificar el acceso a la ruta") )
    );
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['authentication/login'])
  }

  validarToken(){
    return this._http.get<string>(this.url+"/api/ValidacionAccesos/validarToken").pipe(
      catchError( () => {
        this.onLogout();
        this.toastr.error("No se pudo validar el token")
        return throwError('No se pudo validar el token')
      })
    ).subscribe();
  }


}
