import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ComercialService {
  private url = environment.urlApiSatelliteCore + "/api/Comercial/";
  constructor(private _http: HttpClient) {}

  ListarProtocoloAnalisis(body) {
    return this._http
      .post(this.url + "ListarProtocoloAnalisis", body)
      .pipe(catchError(() => throwError("Error al cargar la lista")));
  }

  ListarClientes(body) {
    return this._http
      .post(this.url + "ListarClientes", body)
      .pipe(catchError(() => throwError("Error al cargar la lista")));
  }
  GenerarReporteProtocoloAnalisis(body) {
    return this._http
      .post(this.url + "GenerarReporteProtocoloAnalisis", body)
      .pipe(catchError(() => throwError("Error al registrar el reporte")));
  }

  ListarLicitaciones(body) {
    return this._http
      .post(this.url + "ListarDocumentoLicitacion", body)
      .pipe(catchError(() => throwError("Error al registrar el reporte")));
  }

  GenerarPdfNumeroGuias(body) {
    return this._http
      .post(this.url + "NumerodeGuiaLicitacion", body)
      .pipe(catchError(() => throwError("Error al registrar el reporte")));
  }

  BuscarDocumentoPedido(pedido){
    const params = new HttpParams().set('pedido', pedido)

    return this._http.get<any>(this.url+"NumeroPedido", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener el seguimiento de candidatos"))
    );
  }

  GuardarRotuladoPedido(body) {
    return this._http
      .post(this.url + "RegistrarRotuladosPedido", body)
      .pipe(catchError(() => throwError("Error al registrar el reporte")));
  }


  ListarGuiaPorFacturar(body){
    return this._http
    .post(this.url + "ListarGuiaporFacturar", body)
    .pipe(catchError(() => throwError("Error al registrar el reporte")));
  }

  ListarGuiaporFacturarExportar(body){
    return this._http
    .post(this.url + "ListarGuiaporFacturarExportar", body)
    .pipe(catchError(() => throwError("Error al registrar el reporte")));
  }


  
  RegistrarGuiaPorFacturar(body){
    return this._http
    .post(this.url + "RegistrarGuiaporFacturar", body)
    .pipe(catchError(() => throwError("Error al registrar el reporte")));
  }

}
