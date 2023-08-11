import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ComprasMateriaPrimaArima } from '@data/interface/Response/CompraMateriaPrimaArima';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteOrdenCompraService {
  private url = environment.urlApiSatelliteCore;
  constructor(private _http: HttpClient,private _toastr: ToastrService) { }


  listarFechaPrometida(ordenCompra:string, secuencia:string, item:string){
    const params =  new HttpParams().set('ordenCompra', ordenCompra).set('secuencia', secuencia).set('item',item);
    return this._http.get<any[]>(this.url+"/api/ComprobanteOrdenCompra/MostrarInformacionOrdenCompra", {'params': params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al mostrar el historial de orden Compra ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al mostrar el historial de orden Compra ")
      })
    );
  }

  registrarFechaPrometida(dato){
    return this._http.post(this.url+"/api/ComprobanteOrdenCompra/RegistrarFechaPrometida", dato).pipe(
      catchError( _ => {
        this._toastr.error("Error al registrar la fecha de prometida ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al registrar la fecha de prometida ")
      })
    );
  }

  listadoDetalle(ordenCompra, item, secuencia){
    const params =  new HttpParams().set('ordenCompra', ordenCompra).set('item', item).set('secuencia', secuencia);
    return this._http.get(this.url+"/api/ComprobanteOrdenCompra/MostrarDetalleOrdenCompra", {"params": params}).pipe(
      catchError( _ => {
        this._toastr.error("Error al mostrar el detalle de la orden de compra ", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error  al mostrar el detalle de la orden de compra ")
      })
    );
  }
}
