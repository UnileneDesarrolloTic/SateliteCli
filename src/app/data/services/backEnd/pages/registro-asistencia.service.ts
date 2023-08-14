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
export class RegitroAsistenciaService {

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient, private _toastr: ToastrService) { }

  registrarAsistencia(numeroDocumento){
    const params =  new HttpParams().set('numeroDocumento', numeroDocumento);

    return this._http.get(this.url+"/api/RegistroAsistencia/RegistraAsistencia", {params: params}).pipe(
        catchError( _ => {
          this._toastr.error("Error al registrar la asistencia ", "Error !!", { timeOut: 4000, closeButton: true })
          return throwError("Error  al registrar la asistencia ")
        })
      );
  }

}
