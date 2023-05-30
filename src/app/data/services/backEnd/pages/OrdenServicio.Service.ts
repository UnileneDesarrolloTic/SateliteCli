import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
providedIn:"root"
})

export class OrdenServicioService
{
    private url = environment.urlApiSatelliteCore + "/api/OrdenServicio/";

    constructor(private _http: HttpClient, private _toastr: ToastrService) { }

    listarOrdenesServicio(fechaInicio: Date, fechaFin: Date)
    {
        const params =  new HttpParams().set('fechaInicio', fechaInicio.toString()).set('fechaFin', fechaFin.toString())

        return this._http.get(this.url + "listarOrdenServicio", {'params': params}).pipe(
            map (result => result['content']),
            catchError (() => 
            {
                this._toastr.error("Error al obtener las Ordenes de Servicio","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al obtener las Ordenes de Servicio")
            })
        );
    }

    listarTransportistaCombox()
    {
        return this._http.get(this.url + "listarTransportistaCombox").pipe(
            map (result => result['content']),
            catchError (() => 
            {
                this._toastr.error("Error al obtener los transportistas","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al obtener los transportistas")
            })
        );
    }

    listaDetalleOrdenServicio(codigoOrdenServicio: number)
    {
        const params =  new HttpParams().set('codigoOrdenServicio', codigoOrdenServicio.toString());

        return this._http.get(this.url + "listaDetalleOrdenServicio", {'params': params }).pipe(
            map (result => result['content']),
            catchError (() => 
            {
                this._toastr.error("Error al obtener el detalle de las ordenes de servicio","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al obtener el detalle de las ordenes de servicio")
            })
        );
    }

    listaGuiaRemision(fechaInicio: Date, fechaFin: Date)
    {
        const params =  new HttpParams().set('fechaInicio', fechaInicio.toString()).set('fechaFin', fechaFin.toString())

        return this._http.get(this.url + "listaGuiaRemision", {'params': params}).pipe(
            map (result => result['content']),
            catchError (() => 
            {
                this._toastr.error("Error al obtener las guías de remisión","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al obtener las guías de remisión")
            })
        );
    }

    guardarDetalleOrdenServicio(body: any)
    {
        return this._http.post(this.url + "modificarOrdenServicio", body).pipe(
            catchError (() => 
            {
                this._toastr.error("Error al modificar el detalle de Orden de Servicios","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al modificar el detalle de Orden de Servicios")
            })
        );
    }

    eliminarDetalle(id: number)
    {
        const params =  new HttpParams().set('id', id.toString());

        return this._http.get(this.url + "eliminarDetalle", {'params': params }).pipe(
            catchError (() => 
            {
                this._toastr.error("Error al eliminar el detalle","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al eliminar el detalle")
            })
        );
    }

    editarGuia_OS(body: any){
        return this._http.post(this.url + "editarGuiaRemision", body).pipe(
            catchError (() => 
            {
                this._toastr.error("Error al modifigar los datos de la guia","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al modifigar los datos de la guia")
            })
        );
    }

    guardarTransportista(body: any){
        return this._http.post(this.url + "guardarTransportista", body).pipe(
            catchError (() => 
            {
                this._toastr.error("Error al guardar los datos del transportista","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al guardar los datos del transportista")
            })
        );
    }

    nuevaOrdenServicio(body: any){
        return this._http.post(this.url + "nuevaOrdenServicio", body).pipe(
            catchError (() => 
            {
                this._toastr.error("Error al crear la orden de servicio.","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al crear la orden de servicio.")
            })
        );
    }

    exportarOrdenServicioSalidas(inicio: Date, fin: Date){

        const params =  new HttpParams().set('inicio', inicio.toString()).set('fin', fin.toString());
        return this._http.get(this.url + "exportarOrdenServicioSalidas", {'params': params}).pipe(
            map( resp => resp['content']),
            catchError (() => 
            {
                this._toastr.error("Error al generar el reporte.","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al generar el reporte.")
            })
        );
    }

    exportarOrdenServicio_PDF(id: number){

        const params =  new HttpParams().set('id', id.toString());
        return this._http.get(this.url + "exportarOrdenServicio", {'params': params}).pipe(
            map( resp => resp['content']),
            catchError (() => 
            {
                this._toastr.error("Error al generar el reporte.","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al generar el reporte.")
            })
        );
    }

    retornarOrdenServicio(ordenServicio: string){

        const params =  new HttpParams().set('ordenServicio', ordenServicio);
        return this._http.get(this.url + "ordenServicioRetornada", {'params': params}).pipe(
            catchError (() => 
            {
                this._toastr.error("Error al marcar el retorno de la O.S..","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al marcar el retorno de la O.S..")
            })
        );
    }

    eliminarOrdenServicio(ordenServicio: string){
        const params =  new HttpParams().set('ordenServicio', ordenServicio);
        return this._http.get(this.url + "eliminarOrdenServicio", {'params': params}).pipe(
            catchError (() => 
            {
                this._toastr.error("Error al eliminar la orden de servicio","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al eliminar la orden de servicio")
            })
        );
    }

    reporteGuiaOrdenServicio(fechaInicio: Date, fechaFin: Date){
        const params =  new HttpParams().set('fechaInicio', fechaInicio.toString()).set('fechaFin', fechaFin.toString());
        return this._http.get(this.url + "reporteGuiaOrdenServicio", {'params': params}).pipe(
            catchError (() => 
            {
                this._toastr.error("Error al generar el reporte.","Error Servicio!!", { closeButton: true, progressBar: true, timeOut: 3000});
                return throwError("Error al generar el reporte.")
            })
        );
    }
}