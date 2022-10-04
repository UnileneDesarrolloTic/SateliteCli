import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DocumentoSolicitud, DocumentosPendientesFirma, FiltrosSolitud, ResposeSolicitudPendienteFir, TipoDocumento } from "@data/interface/Response/FirmaDigital.interface";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
    providedIn:"root"
  })
  
  export class FirmaDigitalService
  {
    private url = environment.urlApiSisDoc + "/api/FirmaDigital";

    constructor(private _http: HttpClient, private _toastr: ToastrService) { }

    listarSolicitudes(body: FiltrosSolitud)
    {
        return this._http.post(this.url + "/ListarSolicitudes", body).pipe(
            catchError(() => {
              this._toastr.error("Error al obtener las lista de solicitudes", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
              return throwError("Error al obtener la lista de solitudes")
            })
          )
    }

    registrarSolicitud(body: any)
    {
      return this._http.post(this.url + "/CrearSolicitud", body).pipe(
        catchError(() => {
          this._toastr.error("Error al registrar la solicitud.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
          return throwError("Error al registrar la solicitud.")
        })
      )
    }

    obtenerDetalleSolicituPorId(idSolicitud: number)
    {
      const param = new HttpParams().set('idSolicitud', idSolicitud.toString())

      return this._http.get(this.url + "/ObtenerDetalleSolicitudPorId", {'params': param}).pipe(
        catchError(() => {
          this._toastr.error("Error la obtener el detalle de la solicitud.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
          return throwError("Error la obtener el detalle de la solicitud.")
        })
      )
    }

    listarDocumentosPorSolicitud(idSolicitud: number)
    {
      const param = new HttpParams().set('idSolicitud', idSolicitud.toString())

      return this._http.get(this.url + "/ListarDocumentosPorSolicitud", {'params': param}).pipe(
        map(
          documento => {

            const listaDocumentos: DocumentoSolicitud[] = []

            documento['content'].forEach(documento => {
              listaDocumentos.push({...documento, flagSelect: false})
            });
            
            return listaDocumentos
          }
        ),
        catchError((ex) => {
          this._toastr.error("Error la obtener los documentos de la solicitud.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
          return throwError("Error la obtener los documentos de la solicitud.", ex)
        })
      )
    }

    solicitarFirmaDocumento(body: any)
    {
      return this._http.post(this.url + "/SolicitarFirmarDocumentos", body).pipe(
        catchError(() => {
          this._toastr.error("Error al solictar la firma de documentos.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
          return throwError("Error al solictar la firma de documentos.")
        })
      )
    }

    obtenerDocumento(rutaDocumento: string)
    {
      const urlDocumento = `${environment.urlApiSisDoc}/${rutaDocumento}`;
      // const headers = new HttpHeaders().set("Content-Type", "application/json")

      return this._http.get(urlDocumento, { responseType: 'blob' as 'json' } ).pipe(
        catchError(() => {
          this._toastr.error("Error al descargar el documento.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
          return throwError("Error al descargar el documento.")
        }));
    }

    subirDocumentos(body: FormData)
    {
      return this._http.post(this.url + "/SubirDocumentos", body).pipe(
        catchError((resp: HttpErrorResponse ) => {
          let respuesta:any = resp.error['Content'][0]

          if(resp != undefined)
            this._toastr.error(respuesta, 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
          else
            this._toastr.error("Error al subir los documentos.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
         
          return throwError("Error al subir los documentos");
        })
      );
    }

    obtenerTiposDocumentos(grupo: string): Observable<TipoDocumento[]>
    {
      const param = new HttpParams().set('grupo', grupo)

      return this._http.get<TipoDocumento[]>(this.url + "/ObtenerTiposDocumentos", {'params': param}).pipe(
        map( tipoDocumento => tipoDocumento['content']),
        catchError(() => {
          this._toastr.error("Error al obtener la lista de documentos.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
          return throwError("Error al obtener la lista de documentos");
        })
      );
    }

    solicitudesPendientesFirma(body: any): Observable<ResposeSolicitudPendienteFir>
    {
      return this._http.post<ResposeSolicitudPendienteFir>(this.url + "/SolicitudesPendientesFirma", body).pipe(
        catchError(() => {
          this._toastr.error("Error al obtener las solicitudes pendientes.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
          return throwError("Error al obtener las solicitudes pendientes.");
        })
      );
    }

    documentosPendientesFirma(body: any): Observable<DocumentosPendientesFirma[]>
    {
      return this._http.post<DocumentosPendientesFirma[]>(this.url + "/DocumentosPendientesFirma", body).pipe(
        map(
          documento => {
            const listaDocumentos: DocumentosPendientesFirma[] = []
            documento['content'].forEach(documento => {
              listaDocumentos.push({...documento, flagSelect: false})
            });
            
            return listaDocumentos
          }
        ),
        catchError(() => {
          this._toastr.error("Error al obtener los documentos pendientes.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
          return throwError("Error al obtener los documentos pendientes.");
        })
      );
    }

    firmarDocumento(body: any)
    {
      return this._http.post<ResposeSolicitudPendienteFir>(this.url + "/FirmarDocumentos", body).pipe(
        catchError(() => {
          this._toastr.error("Error al firmar los documentos.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
          return throwError("Error al firmar los documentos.");
        })
      );
    }

    rechazarDocumentos(body: any)
    {
      return this._http.post<ResposeSolicitudPendienteFir>(this.url + "/RechazarDocumentos", body).pipe(
        catchError(() => {
          this._toastr.error("Error al rechazar los documentos.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:4000 })
          return throwError("Error al rechazar los documentos.");
        })
      );
    }
  }  