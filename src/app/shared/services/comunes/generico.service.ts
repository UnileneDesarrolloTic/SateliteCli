import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable , Output} from '@angular/core';
import { Pais } from '@data/interface/Request/Pais.interface';
import { TipoDocumentoIdentidad } from '@data/interface/Request/TipoDocumentoIdentidad.interface';
import { RolData } from '@data/interface/Response/RolData.interface';
import { SubFamilia } from '@data/interface/Response/SubFamilia.Interface';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenericoService {
  @Output() idParams: EventEmitter<any> = new EventEmitter();

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

  ListarFamiliaMateriaP(){
    return this._http.get<SubFamilia[]>(this.url + "/api/Common/ListarFamiliaMP").pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );

  }

  RedondearDecimales(numero, decimales = 2, usarComa = false) {

    var opciones = {
        maximumFractionDigits: decimales,
        useGrouping: false
    };

    return new Intl.NumberFormat((usarComa ? "es" : "en"), opciones).format(numero);
  }


}
