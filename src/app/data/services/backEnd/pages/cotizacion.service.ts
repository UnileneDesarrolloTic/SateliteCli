import { HttpClient, HttpParams } from '@angular/common/http';
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
        // http://172.168.10.22:81/SatelliteCore/api/Cotizacion/ListarCotizaciones 
        // http://localhost:8080/Satelite/api/Cotizacion/Listar
        // api/Cotizacion/Listar
        return this._http.post( `${environment.urlApiSatelliteCore}/api/Cotizacion/Listar`,body).pipe( 
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    FormatoPorCliente(){
        return this._http.get(`${environment.urlApiSatelliteCore}/api/Cotizacion/FormatosPorCliente`).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }


    SeleccionarCotizacion(idformato){
        const params = new HttpParams().set('codFormato', idformato)


        return this._http.get(`${environment.urlApiSatelliteCore}/api/Cotizacion/FormatoEstructura`,{'params':params}).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    InformacionDetalleCotizacion(idFormato,numeroDocumento){
        const params = new HttpParams().set('idFormato', idFormato).set('cotizacion',numeroDocumento);
        
        return this._http.get( `${environment.urlApiSatelliteCore}/api/Cotizacion/FormatoDatos`,{'params':params}).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    FormatoDescarga(nrodocumento){
        const params = new HttpParams().set('cotizacion', nrodocumento);

        return this._http.get(`${environment.urlApiSatelliteCore}/api/Cotizacion/ReportesPorCotizacion`,{'params': params}).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    // /Cotizacion/Guardar 

    RegistrarCotizacion(body){
        return this._http.post(`${environment.urlApiSatelliteCore}/api/Cotizacion/Guardar`,body).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    ObtenerDatosReporte(codigo){
        const params = new HttpParams().set('codigoReporte', codigo);

        return this._http.get(`${environment.urlApiSatelliteCore}/api/Cotizacion/ObtenerDatosReporte`,{'params':params}).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    ObtenerReporte(codigo){

        const params = new HttpParams().set('codigoReporte', codigo);

        return this._http.get(`${environment.urlApiSatelliteCore}/api/Cotizacion/ObtenerReporte`,{'params':params}).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

    // Cotizacion/Actualizacion 
    Actualizar(body){
        return this._http.put(`${environment.urlApiSatelliteCore}/api/Cotizacion/Actualizar`,body).pipe(
            catchError(() => throwError("Error al registrar el reporte"))
        )
    }

}
