import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class PronosticoService {

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { }

  ListSeguimientoCandidatos(body){

    const params =  new HttpParams()
    .set('periodo', body['periodo'])
    .set('primerFiltro', body['primerFiltro'])
    .set('segundoFiltro', body['segundoFiltro'])
    .set('tercerFiltro', body['tercerFiltro'])

    return this._http.get<SeguimientoCandidato[]>(this.url+"/api/Pronostico/ProductosArima", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  ListSeguimientoCandidatosMateriaPrima(regla){
    const params =  new HttpParams().set('regla', regla)

    return this._http.get<SeguimientoCandidato[]>(this.url+"/api/Pronostico/SegimientoCandidatosMP", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  ListaPedidosCreadosAutomaticoLog(body){
    return this._http.post(this.url + "/api/Pronostico/ListaPedidosCreadoAuto", body).pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }

}
