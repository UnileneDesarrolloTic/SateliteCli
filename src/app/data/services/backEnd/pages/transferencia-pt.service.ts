import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
providedIn: 'root'
})
export class TransferenciaMPService {
    private url = environment.urlApiSatelliteCore + "/api/TransferenciaPt";

    constructor(private _http: HttpClient, private _toastr: ToastrService) {}

    listaPendienteTransferenciaFisica(almacen: string){
        const params = new HttpParams().set('almacenCodigo',almacen);

        return this._http.get<any[]>(this.url+"/listaPendienteTransferenciaFisica", {'params': params}).pipe(
            map((x: any) => x.content),
            catchError (() => {
            this._toastr.error("Error al listar los pendientes", "Error !!", { timeOut: 4000, closeButton: true })
            return throwError("Error al listar los pendientes")
            })
        );
    }

    registrarTransfenciaPT(idControl: number, controlNumero: string, cantidadTotal: number, cantidadParcial: number){
        const params = new HttpParams().set('idControl',idControl.toString()).set('controlNumero', controlNumero)
            .set('cantidadTotal', cantidadTotal.toString()).set('cantidadParcial', cantidadParcial.toString());

        return this._http.get<any[]>(this.url+"/registrarTransfenciaPT", {'params': params}).pipe(
            map((x: any) => x.content),
            catchError (() => {
            this._toastr.error("Error al registrar la transferencia", "Error !!", { timeOut: 4000, closeButton: true })
            return throwError("Error al registrar la transferencia")
            })
        );
    }

    listaPendienteRecepcionFisica(almacen: string, estado: string){

        const params = new HttpParams().set('almacen',almacen).set('estado',estado);

        return this._http.get<any[]>(this.url+"/listaPendienteRecepcionFisica", {'params': params}).pipe(
            map((x: any) => x.content),
            catchError (() => {
            this._toastr.error("Error al listar los pendientes", "Error !!", { timeOut: 4000, closeButton: true })
            return throwError("Error al listar los pendientes")
            })
        );
    }

    registrarRecepcionPT(body: any){

        return this._http.post<any[]>(this.url+"/registrarRecepcionPT", body).pipe(
            map((x: any) => x.content),
            catchError (() => {
            this._toastr.error("Error al registrar la recepción de la transferencia.", "Error !!", { timeOut: 4000, closeButton: true })
            return throwError("Error al registrar la recepción de la transferencia.")
            })
        );
    }

}
