import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegistrarReclamoResp } from "@data/interface/Response/Common.interface";
import { CabeceraLoteReclamo, DatosItemPorLote, DatosReclamo, EvidenciaLoteReclamo, FiltrosLotesReclamos, LotesFiltradosReclamo, ReclamosQuejasPaginado, TBDReclamoEntity } from "@data/interface/Response/GestionCalidad.interface";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
  })
  export class GestionCalidadService {
    private url = environment.urlApiSatelliteCore + "/api/GestionCalidad";
    private urlSisDoc = environment.urlApiSisDoc + "/api/GestionCalidad";
    
    constructor(private _http: HttpClient, private _toastr: ToastrService) { }

    listarMateriaPrima(tipoConsulta: string, lote: string)
    {
      const param = new HttpParams().set('tipoConsulta', tipoConsulta ).set('lote', lote)

      return this._http.get(this.url + "/ListarMateriaPrima", {'params': param}).pipe(
        map( (resp: any) => 
        {
            const listaMP: any[] = []

            resp.forEach(materiaPrima => {
                listaMP.push({...materiaPrima, flagSelect: false})
            });
              
            return listaMP
        }),
        catchError(() => {
          this._toastr.error("Error la obtener la lista de materia prima.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error la obtener la lista de materia prima.")
        })
      )
    }

    obtenerDetalleSeguimientoLote(body)
    {
        return this._http.post(this.url + "/DetalleSeguimientoPorLote", body).pipe(
            catchError(() => {
              this._toastr.error("Error al obtener el detalle de la información.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
              return throwError("Error al obtener el detalle de la información.")
            })
          ) 
    }


    obtenerVentaPorCliente(body)
    {
        return this._http.post(this.url + "/VentasPorCliente", body).pipe(
            catchError(() => {
              this._toastr.error("Error al obtener las ventas por cliente.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
              return throwError("Error al obtener las ventas por cliente.")
            })
          ) 
    }

    ReporteVentasPorCliente(body)
    {
      return this._http.post(this.url + "/RptVentasPorCliente", body).pipe(
          catchError(() => {
            this._toastr.error("Error al descargar el reporte.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
            return throwError("Error al descargar el reporte")
          })
      )
    } 

    listaReclamosQuejas(body: any): Observable<ReclamosQuejasPaginado>
    {
      return this._http.post<ReclamosQuejasPaginado>(this.url + "/ListaReclamos", body).pipe(
        catchError(() => {
          this._toastr.error("Error al listar los reclamos y quejas.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error al listar los reclamos y quejas")
        })
      );
    }

    registrarReclamo(codigoCliente: number): Observable<RegistrarReclamoResp>
    {
      const param = new HttpParams().set('codigoCliente', codigoCliente.toString() );

      return this._http.get(this.url + "/RegistrarReclamo", {'params': param}).pipe(
        map( (resp: any) => 
        {
          return resp['content'] as RegistrarReclamoResp;
        }),
        catchError(() => {
          this._toastr.error("Error al registrar el reclamo.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error al registrar el reclamo.")
        })
      )
    }

    obtenerDetalleReclamo(codigoReclamo: string): Observable<DatosReclamo>
    {
      const param = new HttpParams().set('codigoReclamo', codigoReclamo );

      return this._http.get(this.url + "/DetalleReclamo", {'params': param}).pipe(
        map( (resp: DatosReclamo) => 
        {
          return resp['content'] as DatosReclamo;
        }),
        catchError(_ => {
          this._toastr.error("Error obtener el detalle del reclamo.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error obtener el detalle del reclamo.")
        })
      )
    }

    obtenerLotesFiltrados(filtros: FiltrosLotesReclamos): Observable<LotesFiltradosReclamo[]>
    {
      return this._http.post<LotesFiltradosReclamo[]>(this.url + "/LotesFiltradosReclamo", filtros).pipe(
        map( resp => resp['content'] as LotesFiltradosReclamo[] ),
        catchError(_ => {
          this._toastr.error("Error obtener los lotes.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error obtener los lotes.")
        })
      )
    }

    obtenerDatosItemLote(lote: string): Observable<DatosItemPorLote>
    {
      const param = new HttpParams().set('lote', lote );

      return this._http.get(this.url + "/ObtenerDatosItemLote", {'params': param}).pipe(
        map( (resp: DatosItemPorLote) => resp['content'] as DatosItemPorLote),
        catchError(_ => {
          this._toastr.error("Error obtener los datos del item por el lote.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error obtener los datos del item por el lote.")
        })
      )
    }

    guardarDetalleReclamo(detalle: TBDReclamoEntity)
    {
      return this._http.post(this.url + "/GuardarReclamoDetalle", detalle).pipe(
        catchError(_ => {
          this._toastr.error("Error al guardar los datos del detalle.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error al guardar los datos del detalle.")
        })
      )
    }

    actualizarDetelleLoteReclamo(detalle: TBDReclamoEntity)
    {
      return this._http.post(this.url + "/ActualizarDetalleLoteReclamo", detalle).pipe(
        catchError(_ => {
          this._toastr.error("Error al actualizar los datos del detalle.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error al actualizar los datos del detalle.")
        })
      )
    }

    obtenerDatosLoteReclamo(codReclamo: string, lote: string, documento: string):Observable<CabeceraLoteReclamo>
    {
      const param = new HttpParams().set('codReclamo', codReclamo ).set('lote', lote ).set('documento', documento );

      return this._http.get(this.url + "/DatosReclamoLote", {'params': param}).pipe(
        map( (resp: CabeceraLoteReclamo) => resp['content'] as CabeceraLoteReclamo),
        catchError(_ => {
          this._toastr.error("Error obtener los datos del lote reclamado.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error obtener los datos del lote reclamado.")
        })
      )
    }

    subirEvidenciasLoteReclamo(body: FormData)
    {
      return this._http.post(this.urlSisDoc + "/EvidenciasReclamos", body).pipe(
        catchError((resp: HttpErrorResponse ) => 
        {
          let respuesta:any = resp.error['Content'][0]

          if(resp != undefined)
            this._toastr.error(respuesta, 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          else
            this._toastr.error("Error al subir las evidencias.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
         
          return throwError("Error al subir las evidencias");
        })
      );
    }

    obtenerEvidenciasPorIdDetalle(idDetalle: number): Observable<EvidenciaLoteReclamo[]>
    {
      const param = new HttpParams().set('idDetalle', idDetalle.toString() );

      return this._http.get(this.urlSisDoc + "/ListaEvidenciasPorIdDetalle", {'params': param}).pipe(
        map( (resp: EvidenciaLoteReclamo[]) => resp['content'] as EvidenciaLoteReclamo[]),
        catchError(_ => {
          this._toastr.error("Error al obtener las evidencias del reclamo.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error al obtener las evidencias del reclamo.")
        })
      )
    }

    borrarArchivoEvidencia(idDetalle: number, id: number)
    {
      const param = new HttpParams().set('idDetalle', idDetalle.toString() ).set('id', id.toString() );

      return this._http.get(this.urlSisDoc + "/EliminarEvidencaciaReclamo", {'params': param}).pipe(
        catchError(_ => {
          this._toastr.error("Error obtener los datos del lote reclamado.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error obtener los datos del lote reclamado.")
        })
      )
    }

    responderReclamo(body: any)
    {
      return this._http.post(this.url + "/ResponderReclamo", body).pipe(
        catchError(_ => {
          this._toastr.error("Error al registrar la respuesta del reclamado.", 'ERROR !', { closeButton:true, progressBar:true, timeOut:3000 })
          return throwError("Error al registrar la respuesta del reclamado.")
        })
      )
    }
}