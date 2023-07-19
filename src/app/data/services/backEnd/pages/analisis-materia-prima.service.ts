import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})

export class AnalisisMateriaPrimaService {
    private url = environment.urlApiSatelliteCore + "/api/AnalisisMateriaPrima/";

    constructor(private _http: HttpClient, private _toastr: ToastrService) { }

    listarAnalisis(ordenCompra: string, codigoAnalisis: string) {

        const params = new HttpParams().set('ordenCompra', ordenCompra).set("codigoAnalisis", codigoAnalisis);

        return this._http.get(this.url + "listarAnalisisMateriaPrima", { 'params': params }).pipe(
            map (result => result['content']),
            catchError(() => {
                this._toastr.error("Error al listar los análisis", "Error !!", {closeButton: true, timeOut: 3000, progressBar: true});
                return throwError("Error al listar los análisis")
            })
        );
    }

    guardarAnalisisHebra(body: any){

        return this._http.post(this.url + "guardarAnalisisHebra", body).pipe(
            catchError(() => {
              this._toastr.error("Error al guardar los datos del análisis.", "Error en el servidor!!", {timeOut: 4000, closeButton: true, tapToDismiss: true});
              return throwError("Error al guardar los datos del análisis.")
            })
        )
    }

    datosGeneralesAnalisisHebra(ordenCompra: string, numeroAnalisis: string){
        const params = new HttpParams().set('ordenCompra', ordenCompra).set("numeroAnalisis", numeroAnalisis);

        return this._http.get(this.url + "datosGeneralesAnalisisHebra", { 'params': params }).pipe(
            map (result => result['content']),
            catchError(() => {
                this._toastr.error("Error al obtener los datos de análisis de hebra.", "Error !!", {closeButton: true, timeOut: 3000, progressBar: true});
                return throwError("Error al obtener los datos de análisis de hebra.")
            })
        );
    }

    rptAnalisisMateriaPrimaHebra(ordenCompra: string, numeroAnalisis: string) {

        const params = new HttpParams().set('ordenCompra', ordenCompra).set("numeroAnalisis", numeroAnalisis);
        
        return this._http.get(this.url + "rptAnalisisMPHebra", { 'params': params }).pipe(
            catchError(() => {
                this._toastr.error("Error al descargar el reporte de análisis de materia prima.", "Error !!", {closeButton: true, timeOut: 3000, progressBar: true});
                return throwError("Error al descargar el reporte de análisis de materia prima.")
            })
        );
    }

    rptProtocoloAnalisisMateriaPrima(ordenCompra: string, numeroAnalisis: string) {

        const params = new HttpParams().set('ordenCompra', ordenCompra).set("numeroAnalisis", numeroAnalisis);
        
        return this._http.get(this.url + "rptProtocoloAnalisisMateriaPrima", { 'params': params }).pipe(
            catchError(() => {
                this._toastr.error("Error al descargar el reporte de protocolos.", "Error !!", {closeButton: true, timeOut: 3000, progressBar: true});
                return throwError("Error al descargar el reporte de protocolos.")
            })
        );
    }

    datosProtocolo (ordenCompra: string, numeroAnalisis: string){
        const params = new HttpParams().set('ordenCompra', ordenCompra).set("numeroAnalisis", numeroAnalisis);
        
        return this._http.get(this.url + "datosProtocolo", { 'params': params }).pipe(
            catchError(() => {
                this._toastr.error("Error al descargar el reporte de análisis de materia prima.", "Error !!", {closeButton: true, timeOut: 3000, progressBar: true});
                return throwError("Error al descargar el reporte de análisis de materia prima.")
            })
        );
    }

    guardarDatosProtocoloMateriaPrima(body: any)
    {
        return this._http.post(this.url + "guardarDatosProtocoloMateriaPrima", body).pipe(
            catchError(() => {
              this._toastr.error("Error al guardar los datos del protocolo.", "Error en el servidor!!", {timeOut: 4000, closeButton: true, tapToDismiss: true});
              return throwError("Error al guardar los datos del protocolo.")
            })
        )
    }
}
