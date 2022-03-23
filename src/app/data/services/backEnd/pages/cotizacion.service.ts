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
    // /Cotizacion/listar
    ListarCotizacionApi(body){
        return this._http.post( `http://172.168.10.22:81/SatelliteCore/api/Cotizacion/ListarCotizaciones`,body).pipe( 
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    SeleccionarCotizacion(idformato){
        return this._http.get( `http://172.168.10.22:81/SatelliteCore/api/Cotizacion/EstructuraCamposFormato?codFormato=${idformato}`).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    InformacionDetalleCotizacion(idFormato,numeroDocumento){
        return this._http.get( `http://172.168.10.22:81/SatelliteCore/api/Cotizacion/ObtenerDatos?idFormato=${idFormato}&cotizacion=${numeroDocumento}`).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    FormatoPorCliente(){
        return this._http.get(`http://172.168.10.22:81/SatelliteCore/api/Cotizacion/FormatosPorCliente`).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }


    FormatoDescarga(){
        return this._http.get(`http://172.168.10.22:81/SatelliteCore/api/Cotizacion/ReportesPorCotizacion?cotizacion=0000018661`).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    // /Cotizacion/Actualizar

}
