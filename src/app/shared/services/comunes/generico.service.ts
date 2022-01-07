import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais } from '@data/interface/Request/Pais.interface';
import { TipoDocumentoIdentidad } from '@data/interface/Request/TipoDocumentoIdentidad.interface';
import { RolData } from '@data/interface/Response/RolData.interface';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenericoService {

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { }

  listarTipoDocumentoIdentidad(){
    return this._http.get<TipoDocumentoIdentidad[]>(this.url+"/api/Common/ListarTipoDocumentoIdentidad").pipe(
      catchError( () => throwError("Error al obtener los tipos de documentos") )
    );
  }

  listarPaises(){
    return this._http.get<Pais[]>(this.url+"/api/Common/ListarPaises").pipe(
      catchError( () => throwError("Error al obtener los paises") )
    );
  }

  listarRoles(estado: string){

    const params =  new HttpParams().set('estado', estado)

    return this._http.get<RolData[]>(this.url + "/api/Common/listarRoles", {'params': params}).pipe(
      catchError( () => throwError("Error al obtener los roles") )
    );
  }

}
