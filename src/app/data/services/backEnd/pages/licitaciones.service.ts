import { SeguimientoCandidato } from '@data/interface/Response/SeguimientoCandidatos.interdace';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { DetallePedido } from '@data/interface/Response/ListarDetallePedido.interface';

@Injectable({
  providedIn: 'root'
})
export class LicitacionesService {
  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { 
  }

  ListarDetallePedido(Pedido,idCliente){
    const params =  new HttpParams().set('Pedido', Pedido).set("idCliente", idCliente)

    return this._http.get<DetallePedido[]>(this.url+"/api/Licitaciones/ListaDetallePedido", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Pedido"))
    );
  }

}
