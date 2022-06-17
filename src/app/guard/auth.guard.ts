import { catchError, map } from 'rxjs/operators';
import { DataAccesoRuta } from '@data/interface/Request/AccesoRuta.interface';
import { AuthService } from '@data/services/backEnd/auth/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';

import { SesionService } from '@shared/services/comunes/sesion.service';
import { UsuarioSesionData } from '@data/interface/Response/UsuarioSesionDara.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivateChild {

  constructor(private _authService: AuthService, private _toastr: ToastrService, private _sesionService: SesionService,) { }

  resolve(){

  }
  canActivateChild( childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> | boolean
  {
    // return true;
    let ruta = state.url;

    const codigoAnalisis: string = childRoute['params']['codAnalisis'];

    if(codigoAnalisis != undefined && codigoAnalisis != null)
      ruta = state.url.replace(codigoAnalisis, ':codAnalisis');

    const datosUsuario: UsuarioSesionData = this._sesionService.datosPersonales();

    const body = {
      "CodUsuario": datosUsuario.codUsuario,
      "OpcionMenu": ruta
    }

    return this._authService.validarAccesoRuta(body).pipe(
      map((resp: DataAccesoRuta) => {

        if(resp.success){
          if(resp.content.codigo == 2)
            return true
          else {
            if(resp.content.codigo == 0)
              this._toastr.error(resp.content.mensaje, 'Error!')

            if(resp.content.codigo == 1)
              this._toastr.warning(resp.content.mensaje, 'Advertencia!')

            this._authService.onLogout()

            return false
          }}
      }),
      catchError( () => {
        this._authService.onLogout()
        return throwError("Error al obtener datos del usuario")
      } )
    );
  }
}
