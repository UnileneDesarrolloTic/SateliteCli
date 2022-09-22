import { SesionService } from '@shared/services/comunes/sesion.service';
import { Router } from '@angular/router';
import { AuthService } from '@data/services/backEnd/auth/auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private sesionService: SesionService, private authService: AuthService, private router:Router, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let metodoActual: string = ''
    let finTextServicio = req.url.indexOf('?')

    if(finTextServicio = -1)
      metodoActual = req.url.slice( req.url.indexOf('/api/') + 5 );
    else
      metodoActual = req.url.substring(( req.url.indexOf('/api/') + 5 ), finTextServicio )

    let reqClone: HttpRequest<any>;

    const metodosAuth = [
      'Common/ListarTipoDocumentoIdentidad',
      'Common/ListarPaises',
      'Common/ObtenerMenuUsuarioSesion',
      'Common/listarRoles',
      'Common/ListarFamiliaMP',
      'Common/ListarFamilia',
      'Common/ListarFamiliaGeneral',
      'Common/ListarAgrupador',
      'Common/ListarSubAgrupador',
      'Common/ListarLinea',
      'Common/ListarSubFamilia',
      'Common/ListarMarca',
      'Common/ListarMaestroItem',
      'Common/RegistrarMaestroItem',
      'Common/ListarMaestroAlmacen',
      'usuario/ObtenerUsuario',
      'usuario/ListarUsuarios',
      'ValidacionAccesos/ValidarAccesoRuta',
      'ValidacionAccesos/validarToken',
      'Produccion/ProductosArima',
      'Produccion/SegimientoCandidatosMP',
      'Produccion/ListaPedidosCreadoAuto',
      'Produccion/CompraMateriaPrima',
      'Produccion/CompraMateriaPrimaExportar',
      'Produccion/ControlCalidadItemMP',
      'Produccion/MostrarColumnaMP',
      'Produccion/LoteFabricacionEtiquetas',
      'Produccion/RegistrarLoteFabricacionEtiquetas',
      'Produccion/ListarLoteEstado',
      'Produccion/ModificarLoteEstado',
      'Comercial/ListarCotizaciones',
      'Comercial/GenerarReporteCotizacion',
      'Comercial/ObtenerEstructuraFormato',
      'Comercial/RegistrarRespuestas',
      'Comercial/ListarProtocoloAnalisis',
      'Comercial/ListarClientes',
      'Comercial/GenerarReporteProtocoloAnalisis',
      'Comercial/ListarProtocoloAnalisisExportar',
      'Comercial/ListarDocumentoLicitacion',
      'Comercial/NumerodeGuiaLicitacion',
      'Comercial/NumeroPedido',
      'Comercial/RegistrarRotuladosPedido',
      'Comercial/ListarGuiaporFacturar',
      'Comercial/RegistrarGuiaporFacturar',
      'Comercial/ListarGuiaporFacturarExportar',
      'ControlCalidad/ListarCertificados',
      'ControlCalidad/RegistrarCertificado',
      'ControlCalidad/ListarLotes',
      'ControlCalidad/GenerarReporte',
      'ControlCalidad/RegistrarLote',
      'ControlCalidad/OrdenFabricacion',
      'ControlCalidad/ListarTransaccionItem',
      'ControlCalidad/RegistrarOrdenFabricacionCaja',
      'ControlCalidad/ExportarOrdenFabricacionCaja',
      'RRHH/GenerarReporteAsistencia',
      'RRHH/ListarAsistencia',
      'Cotizacion/Listar',
      'Cotizacion/FormatosPorCliente',
      'Cotizacion/FormatoEstructura',
      'Cotizacion/FormatoDatos',
      'Cotizacion/ReportesPorCotizacion',
      'Cotizacion/Guardar',
      'Cotizacion/ObtenerDatosReporte',
      'Cotizacion/ObtenerReporte',
      'Cotizacion/Actualizar',
      'Cotizacion/ListarFormatoCotizacion',
      'Contabilidad/ListarDetraccionContabilidad',
      'Contabilidad/GernerarBlogNotasDetraccion',
      'Contabilidad/ProcesarDetraccionContabilidad',
      'AnalisisAguja/ListaOrdenesCompra',
      'AnalisisAguja/ListarAnalisisAguja',
      'AnalisisAguja/ListarCiclos',
      'AnalisisAguja/CantidadPruebasFlexionPorItem',
      'AnalisisAguja/RegistrarAnalisisAguja',
      'AnalisisAguja/ValidarLoteCreado',
      'AnalisisAguja/AnalisisAgujaFlexion',
      'AnalisisAguja/GuardarEditarPruebaFlexionAguja',
      'AnalisisAguja/ReporteAnalisisFlexion',
      'Common/ObtenerConfiguracionesSistema',
      'AnalisisAguja/ObtenerDatosGenerales',
      'AnalisisAguja/ObtenerPlanMuestreo',
      'AnalisisAguja/GuardarPlanMuestreo',
      'AnalisisAguja/ObtenerPruebaDimensional',
      'AnalisisAguja/GuardarPruebaDimensional',
      'AnalisisAguja/ObtenerPruebaElasticidadPerforacion',
      'AnalisisAguja/GuardarPruebaElasticidadPerforacion',
      'AnalisisAguja/ObtenerPruebaAspecto',
      'AnalisisAguja/GuardarPruebaAspecto',
      'AnalisisAguja/ReporteAnalisisAguja',
      'Licitaciones/ListaDetallePedido',
      'Licitaciones/ListarDistribuccionProceso',
      'Licitaciones/RegistrarDistribuccionProceso',
      'Licitaciones/DashboardLicitacionesExportar',
      'Licitaciones/ListarProceso',
      'Licitaciones/ListarProgramaMuestraLIP',
      'Licitaciones/RegistrarProgramacionMuestreo',
      'Licitaciones/ListarGuiaInformacion',
      'Licitaciones/ListarContratoProceso',
      'Licitaciones/RegistrarContratoProceso',
      'Licitaciones/ObtenerTipoUsuario',
      'Licitaciones/BuscarOrdenCompraLicitaciones',
      'Licitaciones/RegistrarOrdenCompra',
      'Logistica/ObtenerNumeroGuias',
      'Logistica/RegistrarRetornoGuia',
      'Logistica/ListarItemVentas',
      'Logistica/BuscarItemVentas',
      'Logistica/ListarItemVentasExportar',
      'Logistica/ListarItemVentasDetalle',
      'Logistica/DetalleComprometidoItem',
      'Logistica/ListarItemVentasDetalleExportar',
      'FirmaDigital/ListarSolicitudes',
      'FirmaDigital/CrearSolicitud',
      'FirmaDigital/ObtenerDetalleSolicitudPorId',
      'FirmaDigital/ListarDocumentosPorSolicitud',
      'FirmaDigital/SolicitarFirmarDocumentos',
      'FirmaDigital/SubirDocumentos',
      'FirmaDigital/ObtenerTiposDocumentos',
      'FirmaDigital/SolicitudesPendientesFirma',
      'FirmaDigital/DocumentosPendientesFirma',
      'FirmaDigital/FirmarDocumentos',
      'FirmaDigital/RechazarDocumentos'
    ];
    
    const data = this.sesionService.datosPersonales();
    
    if(metodosAuth.indexOf(metodoActual)==-1){
      let headers = new HttpHeaders({
        contentType:"application/json; charset=utf-8"
      });
      reqClone = req.clone({headers});
    }else {

      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + data['token'],
        contentType:"application/json; charset=utf-8",
      });

      reqClone = req.clone({ headers });
    }

    return next.handle(reqClone).pipe(
      finalize( () => {
        if( metodosAuth.indexOf(metodoActual) != -1 )
          if(!data) this.authService.onLogout()
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401){
          if(err.error?.message == 'Correo o contraseña incorrecta.')
            this.toastr.warning('Usuario o contraseña incorrecta.', 'Credencial incorrecta!');
          else
            if(this.authService.isLogin())
              this.toastr.warning('No se ha iniciado sesión', 'Aviso!')
            else
              if(this.authService.isExpiredToken())
                this.toastr.warning('La sesión a expirado', 'Error de Autorización')
              else
                this.toastr.error('Error al validar su identidad', 'Error')

        localStorage.clear();
        this.router.navigate(['authentication/login'])
        }else{
          if(err.status === 403){
            this.toastr.warning('No cuenta con los permisos necesarios.', 'Aviso!')
            this.router.navigate(['/Home']);
            return
          }

        }
        return throwError( err )
      })
    )

  }
}
