import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais } from '@data/interface/Request/Pais.interface';
import { TipoDocumentoIdentidad } from '@data/interface/Request/TipoDocumentoIdentidad.interface';
import { ConfiguracionSistemaDetalle, DatosClienteResponse } from '@data/interface/Response/Common.interface';
import { RolData } from '@data/interface/Response/RolData.interface';
import { SubFamilia } from '@data/interface/Response/SubFamilia.Interface';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenericoService {
  

  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient) { }

  listarTipoDocumentoIdentidad(){
    return this._http.get<TipoDocumentoIdentidad[]>(this.url+"/api/Common/ListarTipoDocumentoIdentidad").pipe(
      catchError( () => throwError("Error al obtener los tipos de documentos") )
    );
  }

  listarPaises(){
    return this._http.get<Pais[]>(this.url+"/api/Common/ListarPaises").pipe(
      catchError( () => throwError("Error al obtener los paises") )
    );
  }

  listarRoles(estado: string){

    const params =  new HttpParams().set('estado', estado)

    return this._http.get<RolData[]>(this.url + "/api/Common/listarRoles", {'params': params}).pipe(
      catchError( () => throwError("Error al obtener los roles") )
    );
  }

  ListarFamiliaMateriaP(tipo){

    const params =  new HttpParams().set('tipo', tipo);

    return this._http.get<SubFamilia[]>(this.url + "/api/Common/ListarFamiliaMP",{'params': params}).pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );

  }


  ListarAgrupador(){
    return this._http.get<any>(this.url + "/api/Common/ListarAgrupador").pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }


  ListarSubAgrupador(idAgrupador){
    const params =  new HttpParams().set('idAgrupador', idAgrupador);

    return this._http.get<any>(this.url + "/api/Common/ListarSubAgrupador",{'params': params}).pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }

  ListarLinea(){
    return this._http.get<any>(this.url + "/api/Common/ListarLinea").pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }

  
  ListarFamiliaMaestroItem(idlinea){
    const params =  new HttpParams().set('idlinea', idlinea);
    return this._http.get<any[]>(this.url + "/api/Common/ListarFamilia",{'params': params}).pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }

  ListarGenerar(idlinea){
    const params =  new HttpParams().set('idlinea', idlinea);
    return this._http.get<any[]>(this.url + "/api/Common/ListarFamiliaGeneral",{'params': params}).pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }

  ListarSubFamilia(idlinea,idfamilia){
    const params =  new HttpParams().set('idlinea', idlinea).set('idfamilia',idfamilia);
    return this._http.get<any[]>(this.url + "/api/Common/ListarSubFamilia",{'params': params}).pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }


  ListarMarca(){    
    return this._http.get<any[]>(this.url + "/api/Common/ListarMarca").pipe(
      catchError ((ex)=> throwError('Ocurrio un error al obtener los pedidos'))
    );
  }

  ListarMaestroItem(body){
    return this._http.post(this.url + "/api/Common/ListarMaestroItem", body).pipe(
        catchError(() => throwError("Error al registrar el reporte"))
    )
  }


  RegistarMaestroItem(body){
    return this._http.post(this.url + "/api/Common/RegistrarMaestroItem", body).pipe(
        catchError(() => throwError("Error al registrar el reporte"))
    )
  }

  ListarMaestroAlmacen(){
    return this._http.get(this.url + "/api/Common/ListarMaestroAlmacen").pipe(
        catchError(() => throwError("Error al registrar el reporte"))
    )
  }

  AccesosPermiso(Permiso){
    const params =  new HttpParams().set('Permiso', Permiso);

    return this._http.get(this.url + "/api/Common/ValidacionPermisoAccesso",{'params': params}).pipe(
      catchError(() => throwError("Error Acceder al permiso"))
    )
  }

  RedondearDecimales(numero, decimales = 2, usarComa = false) {
    var opciones = {
        maximumFractionDigits: decimales,
        useGrouping: false
    };

    return new Intl.NumberFormat((usarComa ? "es" : "en"), opciones).format(numero);
  }

  ObtenerConfiguracion (idConfiguracion:number, grupo:string):Observable<ConfiguracionSistemaDetalle[]>
  {
    const params =  new HttpParams().set('idConfiguracion', idConfiguracion.toString()).set('grupo', grupo);

    return this._http.get<ConfiguracionSistemaDetalle[]>(this.url + "/api/Common/ObtenerConfiguracionesSistema", {'params': params})
    .pipe(
      map( result => result['content'])
      ,catchError( () => throwError("Error al obtener los roles") )
    );
  }

  ObtenerDatosCliente (codioCliente: number): Observable<DatosClienteResponse>
  {
    const params =  new HttpParams().set('codigoCliente', codioCliente.toString());

    return this._http.get(this.url + "/api/Common/DatosCliente", {'params': params})
    .pipe(
      map( result => result['content'] as DatosClienteResponse),
      catchError( () => throwError("Error al obtener los roles") )
    );
  }

}
