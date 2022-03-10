import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn:"root"
})

export class CotizacionService{
    private url = environment.urlApiSatelliteCore + "/api/Comercial/";
    constructor(private _http: HttpClient) { }

    ListarCotizaciones(body){
        return this._http.post(this.url + "ListarCotizaciones", body).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    GenerarReporteCotizacion(body){
        return this._http.post(this.url + "GenerarReporteCotizacion", body).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    ObtenerEstructuraFormato(body){
        return this._http.post(this.url + "ObtenerEstructuraFormato", body).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }
    RegistrarRespuestas(body){
        return this._http.post(this.url + "RegistrarRespuestas", body).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }


    // nuevas apis

    SeleccionarCotizacion(){
        return this._http.get("http://172.168.10.22:81/SatelliteCore/api/Cotizacion/EstructuraCamposFormato?codFormato=3").pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    InformacionDetalleCotizacion(){
        return this._http.get("http://172.168.10.22:81/SatelliteCore/api/Cotizacion/ObtenerDatos?idFormato=3&cotizacion=0000018661").pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }
}
