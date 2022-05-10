import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ComprasMateriaPrimaArima } from '@data/interface/Response/CompraMateriaPrimaArima';


@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { }

  ListarProductosArima(periodo: string){

    const params = new HttpParams().set('periodo', periodo)

    return this._http.get<SeguimientoCandidato[]>(this.url+"/api/Produccion/ProductosArima", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  ListSeguimientoCandidatosMateriaPrima(regla){
    const params =  new HttpParams().set('regla', regla)

    return this._http.get<SeguimientoCandidato[]>(this.url+"/api/Produccion/SegimientoCandidatosMP", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  ListaPedidosCreadosAutomaticoLog(body){
    return this._http.post(this.url + "/api/Produccion/ListaPedidosCreadoAuto", body).pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }
  ListaCompraMP(CompraMp){
    return this._http.post<ComprasMateriaPrimaArima[]>(this.url + "/api/Produccion/CompraMateriaPrima", CompraMp).pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }

  DetalleControlCalidadMP(Item){
    
    const params =  new HttpParams().set('Item', Item)

    return this._http.get<SeguimientoCandidato[]>(this.url+"/api/Produccion/ControlCalidadItemMP", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

}
