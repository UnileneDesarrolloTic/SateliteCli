import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EncajadoService {

  private url = environment.urlApiSatelliteCore + "/api/Encajado";

  constructor(private _http: HttpClient, private _toastr: ToastrService) { }

  listaOrdenesFabricacion(ordenFabricacion: string, lote: string) {
    const params = new HttpParams().set('ordenFabricacion', ordenFabricacion).set('lote', lote)

    return this._http.get(this.url + "/listaOrdenesFabricacion", { "params": params }).pipe(
      catchError(_ => 
      {
        this._toastr.error('Error al obtener la lista de Ordenes de Fabricación.', 'Error !!', {timeOut: 3000, progressBar: true, closeButton: true})
        return throwError("Error al obtener la lista de Ordenes de Fabricación.")
      })
    );
  }

  listaTransferenciasEncaje(ordenFabricacion: string) {
    const params = new HttpParams().set('ordenFabricacion', ordenFabricacion)

    return this._http.get(this.url + "/listaTransferenciasEncaje", { "params": params }).pipe(
      catchError(() => {
        this._toastr.error('Error al obtener la lista de transferencias.', 'Error !!', {timeOut: 3000, progressBar: true, closeButton: true})
        return throwError("Error al obtener la lista de transferencias.")
      })
    );
  }

  registarNuevaTrasnferencia(ordenFabricacion: string, cantidad: number){
    const params = new HttpParams().set('ordenFabricacion', ordenFabricacion).set('cantidad', cantidad.toString())

    return this._http.get(this.url + "/registarNuevaTrasnferencia", { "params": params }).pipe(
      catchError(() => {
        this._toastr.error('Error al registrar la transferencia.', 'Error !!', {timeOut: 3000, progressBar: true, closeButton: true})
        return throwError("Error al registrar la transferencia.")
      })
    );
  }

  listraAsignacionesEncajePorEtapa(idEncaje: number, etapa: number){

    const params = new HttpParams().set('idEncaje', idEncaje.toString()).set('etapa', etapa.toString())

    return this._http.get(this.url + "/listraAsignacionesEncajePorEtapa", { "params": params }).pipe(
      catchError(() => {
        this._toastr.error('Error al listar las asignaciones.', 'Error !!', {timeOut: 3000, progressBar: true, closeButton: true})
        return throwError("Error al listar las asignaciones.")
      })
    );
  }

  registrarAsignacion(body: any){

    return this._http.post(this.url + "/registrarAsignacion", body).pipe(
      catchError(() => {
        this._toastr.error('Error al registrar la asignación.', 'Error !!', {timeOut: 3000, progressBar: true, closeButton: true})
        return throwError("Error al registrar la asignación.")
      })
    );
  }


  actualizaEstadoAsignacion(id: number, estado: string){
    const params = new HttpParams().set('id', id.toString()).set('estado', estado)

    return this._http.get(this.url + "/actualizaEstadoAsignacion", { "params": params }).pipe(
      catchError(() => {
        this._toastr.error('Error al actualizar la asignación..', 'Error !!', {timeOut: 3000, progressBar: true, closeButton: true})
        return throwError("Error al actualizar la asignación..")
      })
    );
  }
}
