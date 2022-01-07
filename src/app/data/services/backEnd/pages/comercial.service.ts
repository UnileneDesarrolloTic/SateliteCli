import { HttpClient } from "@angular/common/http";
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
}
