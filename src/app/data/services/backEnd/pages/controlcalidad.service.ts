import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ControlcalidadService {
  private url = environment.urlApiSatelliteCore;

  constructor(private _http: HttpClient,private _toastr: ToastrService) { 
  }

  ObtenerInformacionLote(NumeroLote){
    const params =  new HttpParams().set('NumeroLote', NumeroLote)
    return this._http.get<any>(this.url+"/api/ControlCalidad/ObtenerInformacionLote", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Orden Fabicacion"))
    );
  }

  ObtenerTransaccion(OrdenFabricacion,codAlmacen){
    const params =  new HttpParams().set('NumeroLote', OrdenFabricacion).set('codAlmacen',codAlmacen);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarTransaccionItem", {'params': params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }

  RegistrarLoteNumeroCaja(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/RegistrarLoteNumeroCaja", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }


  ListarKardexInternoGCM(NumeroLote){
    const params =  new HttpParams().set('NumeroLote', NumeroLote);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarKardexInternoNumeroLote", {'params':params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }

  RegistrarKardexInternoGCM(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/RegistrarKardexInternoGCM", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }

  ActualizarKardexInternoGCM(idKardex,comentarios){
    const params =  new HttpParams().set('idKardex', idKardex).set('comentarios',comentarios);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ActualizarKardexInternoGCM", {'params':params}).pipe(
      catchError (() => throwError("Error al obtener Detalle de Transaccion"))
    );
  }

  ExportarOrdenFabricacionCaja(anioProduccion){
    const params =  new HttpParams().set('anioProduccion', anioProduccion);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ExportarOrdenFabricacionCaja",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Datos Exportar Caja"))
    );
  }


  ListarControlLotes(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/ListarControlLotes", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de listar de control lote "))
    );
  }

  ActualizarControlLotes(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/ActualizarControlLotes", body).pipe(
      catchError (() => throwError("Error al obtener Detalle de listar de control lote "))
    );
  }


  ListarTablaNumeroParte(Grupo,Tabla){
    const params =  new HttpParams().set('Grupo', Grupo).set('Tabla',Tabla);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarMaestroNumeroParte",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Tabla de  Numero de Parte"))
    );
  }

  ListarTablaAtributo(){
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarAtributos").pipe(
      catchError (() => throwError("Error al obtener Tabla de Atributo"))
    );
  }

  ListarTablaDescripcion(Marca,Hebra){
    const params =  new HttpParams().set('Marca', Marca).set('Hebra',Hebra);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarDescripcion",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Tabla de Atributo"))
    );
  }

  ListarTablaLeyenda(Marca,Hebra){
    const params =  new HttpParams().set('Marca', Marca).set('Hebra',Hebra);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarLeyenda",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Tabla de Atributo"))
    );
  }

  ListarTablaPrueba(Metodologia){
    const params =  new HttpParams().set('Metodologia', Metodologia);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarTablaPrueba",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Tabla de Prueba"))
    );
  }

  ListarObtenerListadoAgujasDescripcion(idDescripcion){
    const params =  new HttpParams().set('IdDescripcion', idDescripcion);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarObtenerAgujasDescripcionActualizar",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Tabla Descripcion"))
    );
  }

  ListarObtenerAgujasDescripcionNuevo(){  
    return this._http.get<any>(this.url+"/api/ControlCalidad/ListarObtenerAgujasDescripcionNuevo").pipe(
      catchError (() => throwError("Error al obtener Tabla Descripcion"))
    );
  }

  NuevoDescripcionDT(body){  
    return this._http.post<any>(this.url+"/api/ControlCalidad/NuevoDescripcionDT",body).pipe(
      catchError (() => throwError("Error al obtener Registrar Nueva DescripcionDT"))
    );
  }

  ActualizarDescripcionDT(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/ActualizarDescripcionDT",body).pipe(
      catchError (() => throwError("Error al obtener Actualizar Nueva DescripcionDT"))
    );
  }


  EliminarDescripcionDT(idDescripcion){
    const params =  new HttpParams().set('IdDescripcion', idDescripcion);
    return this._http.get<any>(this.url+"/api/ControlCalidad/EliminarDescripcionDT",{'params':params}).pipe(
      catchError (() => throwError("Error al Eliminar Descripcion"))
    );
  }


  RegistrarLeyendaDT(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/RegistrarActualizarLeyendaDT",body).pipe(
      catchError (() => throwError("Error al obtener Registrar Leyendas"))
    );
  }

  
  EliminarLeyendaDT(idLeyenda){
    const params =  new HttpParams().set('IdLeyenda', idLeyenda);
    return this._http.get<any>(this.url+"/api/ControlCalidad/EliminarLeyendaDT",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Eliminar Leyenda"))
    );
  }


  EliminarPueba(IdPrueba){
    const params =  new HttpParams().set('IdPrueba', IdPrueba);
    return this._http.get<any>(this.url+"/api/ControlCalidad/EliminarPruebaDT",{'params':params}).pipe(
      catchError (() => throwError("Error al obtener Eliminar Leyenda"))
    );
  }


  //FORMATO DE PROTOCOLO

  BuscarNumeroLoteProtocolo(NumeroLote,Idioma){
    const params =  new HttpParams().set('NumeroLote', NumeroLote).set('Idioma',Idioma);
    return this._http.get<any>(this.url+"/api/ControlCalidad/BuscarNumeroLoteProtocolo",{'params':params}).pipe(
      catchError (() => throwError("Error al buscar Número de lote protocolo"))
    );
  }

  BusquedaPruebaProtocolo(NumeroLote,NumeroParte,Idioma){
    const params =  new HttpParams().set('NumeroLote', NumeroLote).set('NumeroParte',NumeroParte).set('Idioma',Idioma);
    return this._http.get<any>(this.url+"/api/ControlCalidad/BuscarPruebaFormatoProtocolo",{'params':params}).pipe(
      catchError (() => throwError("Error al buscar Número de lote protocolo"))
    );
  }

  BusquedaInformacionResultado(NumeroLote){
    const params =  new HttpParams().set('NumeroLote', NumeroLote);
    return this._http.get<any>(this.url+"/api/ControlCalidad/BuscarInformacionResultadoProtocolo",{'params':params}).pipe(
      catchError (() => throwError("Error al buscar Resultado Informacion"))
    );
  }
  

  RegistrarControlProcesoProtocolo(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/RegistrarControlProcesoProtocolo",body).pipe(
      catchError((ex) => {
        this._toastr.error("Error al guardar el formulario control en proceso", "Error !!", { timeOut: 4000, closeButton: true })
        return throwError("Error al guardar los datos del formulario de control en proceso")
      })
    );
  }

  
  RegistrarControlPTProtocolo(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/RegistrarControlPTProtocolo",body).pipe(
      catchError (() => throwError("Error al obtener Registrar Control Proceso"))
    );
  }

  RegistrarFormatoProtocolo(body){
    return this._http.post<any>(this.url+"/api/ControlCalidad/RegistrarFormatoProtocolo",body).pipe(
      catchError (() => throwError("Error al obtener Registrar Formato Proceso"))
    );
  }

  ImprimirControlProcesoInterno(NumeroLote){
    const params =  new HttpParams().set('NumeroLote', NumeroLote);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ImprimirControlProcesoInterno", {'params':params}).pipe(
      catchError (() => throwError("Error al obtener Registrar Formato Proceso"))
    );
  }

  ImprimirControlPruebas(NumeroLote){
    const params =  new HttpParams().set('NumeroLote', NumeroLote);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ImprimirControlPruebas", {'params':params}).pipe(
      catchError (() => throwError("Error al obtener Registrar Formato Proceso"))
    );
  }

  ImprimirDocumentoControPruebasProtocolo(NumeroLote,Opcion,Idioma){
    const params =  new HttpParams().set('NumeroLote', NumeroLote).set('Opcion',Opcion).set('Idioma',Idioma);
    return this._http.get<any>(this.url+"/api/ControlCalidad/ImprimirDocumentoProtocolo", {'params':params}).pipe(
      catchError (() => throwError("Error al obtener Registrar Formato Proceso"))
    );
  }
}
